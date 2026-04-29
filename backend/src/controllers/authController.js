const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const {
    isValidEmail,
    isStrongPassword,
    exceedsMaxLength,
    MAX_SHORT_TEXT,
    MAX_MEDIUM_TEXT,
    MAX_LONG_TEXT,
    PASSWORD_POLICY_MESSAGE,
} = require('../utils/validators');
const { companyMayUsePortal } = require('../utils/companyAccountStatus');

// reject any value that is not a plain string (blocks NoSql injection like { $gt: "" })
const isPlainString = (v) => typeof v === 'string';

const STUDENT_YEAR_VALUES = new Set(['First', 'Second', 'Third', 'Fourth', 'Fifth']);
const ADMIN_GENDER_VALUES = new Set(['Male', 'Female', '']);
const STUDENT_ID_MIN_LENGTH = 7;
const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

const buildStudentResponse = (student) => ({
    id: student._id,
    universityID: student.universityID,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    mobileNo: student.mobileNo,
    gender: student.gender,
    universityName: student.universityName,
    major: student.major,
    year: student.year,
    skills: student.skills,
    role: student.role,
    status: student.status,
});

const buildCompanyResponse = (company) => ({
    id: company._id,
    email: company.email,
    companyName: company.companyName,
    industry: company.industry,
    phone: company.phone,
    website: company.website,
    size: company.size,
    location: company.location,
    contactPerson: company.contactPerson,
    description: company.description,
    foundedYear: company.foundedYear,
    joinReason: company.joinReason,
    status: company.status,
    role: company.role,
});

const buildAdminResponse = (admin) => ({
    id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    jobTitle: admin.jobTitle,
    gender: admin.gender,
    country: admin.country,
    language: admin.language,
    extraInfo: admin.extraInfo,
    role: admin.role,
    status: admin.status,
});


// student register
const registerStudent = async (req, res) => {
    try{
       const{ 
        universityID,
        firstName,
        lastName,
        email,
        password,
        mobileNo,
        gender,
        universityName,
        major,
        year,
        skills,
    } = req.body;

    if ( !universityID || !firstName || !lastName || !email ||
        !password || !mobileNo || !gender || !universityName ||
        !major || !year
    ) {
        return res.status(400).json({
            message: 'Please provide all required student fields',
        });
    }

    // ensure scalar string inputs to block injection objects
    if (![universityID, firstName, lastName, email, password, mobileNo, gender, universityName, major]
        .every(isPlainString)) {
        return res.status(400).json({ message: 'Invalid input format' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            message: PASSWORD_POLICY_MESSAGE,
        });
    }

    if (universityID.trim().length < STUDENT_ID_MIN_LENGTH) {
        return res.status(400).json({ message: 'University ID must be more than 6 characters' });
    }

    // hard cap user-supplied text fields to defend against absurdly long inputs
    const overlongField = [
        ['universityID', universityID],
        ['firstName', firstName],
        ['lastName', lastName],
        ['email', email],
        ['mobileNo', mobileNo],
        ['universityName', universityName],
        ['major', major],
    ].find(([, value]) => exceedsMaxLength(value, MAX_SHORT_TEXT));

    if (overlongField) {
        return res.status(400).json({
            message: `${overlongField[0]} exceeds maximum length of ${MAX_SHORT_TEXT} characters`,
        });
    }

    const existingStudent = await Student.findOne({ email });
    if(existingStudent){
        return res.status(400).json({message: 'Student already exists'});
    }

    const existingByUniId = await Student.findOne({ universityID });
    if (existingByUniId) {
        return res.status(400).json({ message: 'Student ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
        universityID,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNo,
      gender,
      universityName,
      major,
      year,
      skills: Array.isArray(skills) ? skills : [],
    });

    return res.status(201).json({
        message: 'Student registered successfully',
        token: generateToken(student._id, student.role),
        student: buildStudentResponse(student),
    });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// Student login
const loginStudent = async (req,res) => {
    try{
        const {email, password } = req.body;
        if (!isPlainString(email) || !isPlainString(password)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const student = await Student.findOne({ email }).select('+password');
        if (!student){
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        // block inactive / pending students (only "active" may sign in)
        const studentState = (student.status || 'active').toString().toLowerCase();
        if (studentState !== 'active') {
            return res.status(403).json({
                message:
                    'This account is not active. You cannot sign in until an administrator reactivates it.',
            });
        }

        return res.status(200).json({
            message: 'Student login successful',
            token: generateToken(student._id, student.role),
            student: buildStudentResponse(student),
        });

    } catch(error){
        return res.status(500).json({ message: error.message});
    }
};

// company Login
const loginCompany = async (req,res) => {
    try{
        const {email,password} = req.body;
        if (!isPlainString(email) || !isPlainString(password)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const company = await Company.findOne({email}).select('+password');
        if(!company){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        if (!companyMayUsePortal(company.status)) {
            return res.status(403).json({
                message:
                    'This company account cannot sign in until an administrator sets its status to Active.',
            });
        }

        return res.status(200).json({
            message: 'Company login successful',
            token: generateToken(company._id,  company.role),
            company: buildCompanyResponse(company),
        });
    } 
    catch (error) {
        return res.status(500).json({message: error.message});
    }
};

// Admin login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isPlainString(email) || !isPlainString(password)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const admin = await Admin.findOne({ email }).select('+password');
        if(!admin){
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch)
        {
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        const adminState = admin.status || 'Active';
        if (adminState !== 'Active') {
            return res.status(403).json({
                message:
                    'This admin account is not active. You cannot sign in until reactivated by another administrator.',
            });
        }

        return res.status(200).json({
            message: 'Admin login successful',
            token: generateToken(admin._id, admin.role),
            admin: buildAdminResponse(admin),
        });
    } catch(error){
        return res.status(500).json({ message: error.message });
    }
};

// --- Authenticated profile updates (own account only) ---

const updateStudentProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNo, gender, universityName, major, year, skills, universityID, password } = req.body;
        const $set = {};

        if (firstName !== undefined) {
            if (!isPlainString(firstName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = firstName.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'First name cannot be empty' });
            }
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'firstName exceeds maximum length of 100 characters' });
            }
            $set.firstName = t;
        }
        if (lastName !== undefined) {
            if (!isPlainString(lastName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = lastName.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'Last name cannot be empty' });
            }
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'lastName exceeds maximum length of 100 characters' });
            }
            $set.lastName = t;
        }
        if (email !== undefined) {
            if (!isPlainString(email)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const nextEmail = email.trim().toLowerCase();
            if (!isValidEmail(nextEmail)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            if (exceedsMaxLength(nextEmail, 100)) {
                return res.status(400).json({ message: 'email exceeds maximum length of 100 characters' });
            }
            const taken = await Student.findOne({
                email: nextEmail,
                _id: { $ne: req.user.id },
            });
            if (taken) {
                return res.status(400).json({ message: 'This email is already in use' });
            }
            $set.email = nextEmail;
        }
        if (mobileNo !== undefined) {
            if (!isPlainString(mobileNo)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = mobileNo.trim();
            if (exceedsMaxLength(t, 20)) {
                return res.status(400).json({ message: 'mobileNo exceeds maximum length of 20 characters' });
            }
            $set.mobileNo = t;
        }
        if (gender !== undefined) {
            if (!isPlainString(gender) || !['Male', 'Female'].includes(gender)) {
                return res.status(400).json({ message: 'Invalid gender' });
            }
            $set.gender = gender;
        }
        if (universityName !== undefined) {
            if (!isPlainString(universityName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = universityName.trim();
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'universityName exceeds maximum length of 100 characters' });
            }
            $set.universityName = t;
        }
        if (major !== undefined) {
            if (!isPlainString(major)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = major.trim();
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'major exceeds maximum length of 100 characters' });
            }
            $set.major = t;
        }
        if (year !== undefined) {
            if (!isPlainString(year) || !STUDENT_YEAR_VALUES.has(year)) {
                return res.status(400).json({ message: 'Invalid year' });
            }
            $set.year = year;
        }
        if (skills !== undefined) {
            let list;
            if (Array.isArray(skills)) {
                if (!skills.every((x) => isPlainString(x))) {
                    return res.status(400).json({ message: 'Invalid skills format' });
                }
                list = skills.map((s) => s.trim()).filter(Boolean);
            } else if (isPlainString(skills)) {
                list = skills.split(',').map((s) => s.trim()).filter(Boolean);
            } else {
                return res.status(400).json({ message: 'Invalid skills format' });
            }
            const overlongSkill = list.find((s) => exceedsMaxLength(s, MAX_SHORT_TEXT));
            if (overlongSkill) {
                return res.status(400).json({
                    message: `Each skill must be ${MAX_SHORT_TEXT} characters or less`,
                });
            }
            $set.skills = list;
        }
        if (universityID !== undefined) {
            if (!isPlainString(universityID)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = universityID.trim();
            if (t.length < STUDENT_ID_MIN_LENGTH) {
                return res.status(400).json({ message: 'University ID must be more than 6 characters' });
            }
            if (exceedsMaxLength(t, 50)) {
                return res.status(400).json({ message: 'universityID exceeds maximum length of 50 characters' });
            }
            const taken = await Student.findOne({
                universityID: t,
                _id: { $ne: req.user.id },
            });
            if (taken) {
                return res.status(400).json({ message: 'Student ID already exists' });
            }
            $set.universityID = t;
        }
        if (password !== undefined) {
            if (!isPlainString(password)) {
                return res.status(400).json({ message: 'Invalid password format' });
            }
            if (password.trim() !== '') {
                if (!isStrongPassword(password)) {
                    return res.status(400).json({
                        message: PASSWORD_POLICY_MESSAGE,
                    });
                }
                $set.password = await bcrypt.hash(password, 10);
            }
        }
        if (Object.keys($set).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { $set },
            { new: true, runValidators: true }
        ).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.status(200).json({
            message: 'Profile updated',
            student: buildStudentResponse(student),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or university ID already in use' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

const updateCompanyProfile = async (req, res) => {
    try {
        const {
            companyName, industry, phone, website, size, location, contactPerson, description, foundedYear, joinReason, password,
        } = req.body;
        const $set = {};
        const currentYear = new Date().getFullYear();

        if (companyName !== undefined) {
            if (!isPlainString(companyName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = companyName.trim();
            if (t.length < 3) {
                return res.status(400).json({ message: 'Company name must be at least 3 characters' });
            }
            if (exceedsMaxLength(t, 200)) {
                return res.status(400).json({ message: 'companyName exceeds maximum length of 200 characters' });
            }
            $set.companyName = t;
        }
        if (industry !== undefined) {
            if (!isPlainString(industry)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = industry.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'Industry cannot be empty' });
            }
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'industry exceeds maximum length of 100 characters' });
            }
            $set.industry = t;
        }
        if (phone !== undefined) {
            if (!isPlainString(phone)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = phone.trim();
            if (!PHONE_REGEX.test(t)) {
                return res.status(400).json({ message: 'Please enter a valid phone number' });
            }
            if (exceedsMaxLength(t, 20)) {
                return res.status(400).json({ message: 'phone exceeds maximum length of 20 characters' });
            }
            $set.phone = t;
        }
        if (website !== undefined) {
            if (!isPlainString(website)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = website.trim();
            if (t && !URL_REGEX.test(t)) {
                return res.status(400).json({ message: 'Please enter a valid website URL' });
            }
            if (exceedsMaxLength(t, 200)) {
                return res.status(400).json({ message: 'website exceeds maximum length of 200 characters' });
            }
            $set.website = t;
        }
        if (size !== undefined) {
            if (!isPlainString(size)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = size.trim();
            if (exceedsMaxLength(t, 50)) {
                return res.status(400).json({ message: 'size exceeds maximum length of 50 characters' });
            }
            $set.size = t;
        }
        if (location !== undefined) {
            if (!isPlainString(location)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = location.trim();
            if (t.length < 3) {
                return res.status(400).json({ message: 'Location must be at least 3 characters' });
            }
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'location exceeds maximum length of 100 characters' });
            }
            $set.location = t;
        }
        if (contactPerson !== undefined) {
            if (!isPlainString(contactPerson)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = contactPerson.trim();
            if (t.length < 3) {
                return res.status(400).json({ message: 'Contact person name must be at least 3 characters' });
            }
            if (exceedsMaxLength(t, 100)) {
                return res.status(400).json({ message: 'contactPerson exceeds maximum length of 100 characters' });
            }
            $set.contactPerson = t;
        }
        if (description !== undefined) {
            if (!isPlainString(description)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = description.trim();
            if (exceedsMaxLength(t, MAX_LONG_TEXT)) {
                return res.status(400).json({
                    message: `description exceeds maximum length of ${MAX_LONG_TEXT} characters`,
                });
            }
            $set.description = t;
        }
        if (joinReason !== undefined) {
            if (!isPlainString(joinReason)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = joinReason.trim();
            if (exceedsMaxLength(t, MAX_LONG_TEXT)) {
                return res.status(400).json({
                    message: `joinReason exceeds maximum length of ${MAX_LONG_TEXT} characters`,
                });
            }
            $set.joinReason = t;
        }
        if (foundedYear !== undefined && foundedYear !== null && foundedYear !== '') {
            const yearNum = Number(foundedYear);
            if (!Number.isInteger(yearNum) || yearNum < 1800 || yearNum > currentYear) {
                return res.status(400).json({
                    message: `foundedYear must be an integer between 1800 and ${currentYear}`,
                });
            }
            $set.foundedYear = yearNum;
        }
        if (password !== undefined) {
            if (!isPlainString(password)) {
                return res.status(400).json({ message: 'Invalid password format' });
            }
            if (password.trim() !== '') {
                if (!isStrongPassword(password)) {
                    return res.status(400).json({
                        message: PASSWORD_POLICY_MESSAGE,
                    });
                }
                $set.password = await bcrypt.hash(password, 10);
            }
        }
        if (Object.keys($set).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        const company = await Company.findByIdAndUpdate(
            req.user.id,
            { $set },
            { new: true, runValidators: true }
        ).select('-password');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        return res.status(200).json({
            message: 'Profile updated',
            company: buildCompanyResponse(company),
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, jobTitle, gender, country, language, extraInfo, password } = req.body;
        const $set = {};

        if (firstName !== undefined) {
            if (!isPlainString(firstName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = firstName.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'First name cannot be empty' });
            }
            if (exceedsMaxLength(t, MAX_SHORT_TEXT)) {
                return res.status(400).json({
                    message: `firstName exceeds maximum length of ${MAX_SHORT_TEXT} characters`,
                });
            }
            $set.firstName = t;
        }
        if (lastName !== undefined) {
            if (!isPlainString(lastName)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = lastName.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'Last name cannot be empty' });
            }
            if (exceedsMaxLength(t, MAX_SHORT_TEXT)) {
                return res.status(400).json({
                    message: `lastName exceeds maximum length of ${MAX_SHORT_TEXT} characters`,
                });
            }
            $set.lastName = t;
        }
        if (phone !== undefined) {
            if (!isPlainString(phone)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = phone.trim();
            if (t.length < 1) {
                return res.status(400).json({ message: 'Phone cannot be empty' });
            }
            if (exceedsMaxLength(t, MAX_MEDIUM_TEXT)) {
                return res.status(400).json({
                    message: `phone exceeds maximum length of ${MAX_MEDIUM_TEXT} characters`,
                });
            }
            $set.phone = t;
        }
        if (jobTitle !== undefined) {
            if (!isPlainString(jobTitle)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = jobTitle.trim();
            if (exceedsMaxLength(t, MAX_MEDIUM_TEXT)) {
                return res.status(400).json({
                    message: `jobTitle exceeds maximum length of ${MAX_MEDIUM_TEXT} characters`,
                });
            }
            $set.jobTitle = t;
        }
        if (gender !== undefined) {
            if (!isPlainString(gender) || !ADMIN_GENDER_VALUES.has(gender)) {
                return res.status(400).json({ message: 'Invalid gender' });
            }
            $set.gender = gender;
        }
        if (country !== undefined) {
            if (!isPlainString(country)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = country.trim();
            if (exceedsMaxLength(t, MAX_SHORT_TEXT)) {
                return res.status(400).json({
                    message: `country exceeds maximum length of ${MAX_SHORT_TEXT} characters`,
                });
            }
            $set.country = t;
        }
        if (language !== undefined) {
            if (!isPlainString(language)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = language.trim();
            if (exceedsMaxLength(t, MAX_SHORT_TEXT)) {
                return res.status(400).json({
                    message: `language exceeds maximum length of ${MAX_SHORT_TEXT} characters`,
                });
            }
            $set.language = t;
        }
        if (extraInfo !== undefined) {
            if (!isPlainString(extraInfo)) {
                return res.status(400).json({ message: 'Invalid input format' });
            }
            const t = extraInfo.trim();
            if (exceedsMaxLength(t, MAX_LONG_TEXT)) {
                return res.status(400).json({
                    message: `extraInfo exceeds maximum length of ${MAX_LONG_TEXT} characters`,
                });
            }
            $set.extraInfo = t;
        }
        if (password !== undefined) {
            if (!isPlainString(password)) {
                return res.status(400).json({ message: 'Invalid password format' });
            }
            if (password.trim() !== '') {
                if (!isStrongPassword(password)) {
                    return res.status(400).json({
                        message: PASSWORD_POLICY_MESSAGE,
                    });
                }
                $set.password = await bcrypt.hash(password, 10);
            }
        }
        if (Object.keys($set).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        const admin = await Admin.findByIdAndUpdate(
            req.user.id,
            { $set },
            { new: true, runValidators: true }
        ).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({
            message: 'Profile updated',
            admin: buildAdminResponse(admin),
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.status(200).json({ student: buildStudentResponse(student) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id).select('-password');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        return res.status(200).json({ company: buildCompanyResponse(company) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({ admin: buildAdminResponse(admin) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    loginCompany,
    loginAdmin,
    getStudentProfile,
    getCompanyProfile,
    getAdminProfile,
    updateStudentProfile,
    updateCompanyProfile,
    updateAdminProfile,
};
