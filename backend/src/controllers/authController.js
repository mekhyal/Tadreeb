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
} = require('../utils/validators');

// reject any value that is not a plain string (blocks NoSQL injection like { $gt: "" })
const isPlainString = (v) => typeof v === 'string';

// company accounts must be in one of these states to use the portal
const COMPANY_LOGIN_ALLOWED = new Set(['Approved', 'Active']);


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
            message: 'Password must be at least 8 characters and include a letter and a number',
        });
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
        return res.status(400).json({ message: 'University ID already registered' });
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
        student: {
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
        },
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
        const student = await Student.findOne({ email });
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
            student: {
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
            },
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

        const company = await Company.findOne({email});
        if(!company){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        if (!COMPANY_LOGIN_ALLOWED.has(company.status)) {
            return res.status(403).json({
                message:
                    'This company account cannot sign in yet. It must be Approved or Active by an administrator.',
            });
        }

        return res.status(200).json({
            message: 'Company login successful',
            token: generateToken(company._id,  company.role),
            company: {
                id: company._id, 
                email: company.email,
                industry: company.industry,
                location: company.location,
                status: company.status,
                role: company.role,
            },
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

        const admin = await Admin.findOne({ email });
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
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
                role: admin.role,
                status: admin.status,
            },
        });
    } catch(error){
        return res.status(500).json({ message: error.message });
    }
};

// --- Authenticated profile updates (own account only) ---

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

const updateStudentProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNo, gender, universityName, major, year, skills, universityID, password } = req.body;
        const $set = {};
        if (firstName !== undefined) $set.firstName = String(firstName).trim();
        if (lastName !== undefined) $set.lastName = String(lastName).trim();
        if (email !== undefined) {
            const nextEmail = String(email).trim().toLowerCase();
            if (!isValidEmail(nextEmail)) {
                return res.status(400).json({ message: 'Invalid email format' });
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
        if (mobileNo !== undefined) $set.mobileNo = String(mobileNo).trim();
        if (gender !== undefined) $set.gender = gender;
        if (universityName !== undefined) $set.universityName = String(universityName).trim();
        if (major !== undefined) $set.major = String(major).trim();
        if (year !== undefined) $set.year = year;
        if (skills !== undefined) {
            $set.skills = Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()).filter(Boolean);
        }
        if (universityID !== undefined) $set.universityID = String(universityID).trim();
        if (password !== undefined && String(password).length >= 8) {
            if (!isStrongPassword(String(password))) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters and include a letter and a number',
                });
            }
            $set.password = await bcrypt.hash(String(password), 10);
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
    status: company.status,
    role: company.role,
});

const updateCompanyProfile = async (req, res) => {
    try {
        const {
            companyName, industry, phone, website, size, location, contactPerson, description, foundedYear, joinReason, password,
        } = req.body;
        const $set = {};
        if (companyName !== undefined) $set.companyName = String(companyName).trim();
        if (industry !== undefined) $set.industry = String(industry).trim();
        if (phone !== undefined) $set.phone = String(phone).trim();
        if (website !== undefined) $set.website = String(website).trim();
        if (size !== undefined) $set.size = String(size).trim();
        if (location !== undefined) $set.location = String(location).trim();
        if (contactPerson !== undefined) $set.contactPerson = String(contactPerson).trim();
        if (description !== undefined) $set.description = String(description).trim();
        if (foundedYear !== undefined && foundedYear !== null && foundedYear !== '') {
            $set.foundedYear = Number(foundedYear);
        }
        if (joinReason !== undefined) $set.joinReason = String(joinReason).trim();
        if (password !== undefined && String(password).length >= 8) {
            if (!isStrongPassword(String(password))) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters and include a letter and a number',
                });
            }
            $set.password = await bcrypt.hash(String(password), 10);
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

const updateAdminProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, jobTitle, gender, country, language, extraInfo, password } = req.body;
        const $set = {};
        if (firstName !== undefined) $set.firstName = String(firstName).trim();
        if (lastName !== undefined) $set.lastName = String(lastName).trim();
        if (phone !== undefined) $set.phone = String(phone).trim();
        if (jobTitle !== undefined) $set.jobTitle = String(jobTitle).trim();
        if (gender !== undefined) $set.gender = gender;
        if (country !== undefined) $set.country = String(country).trim();
        if (language !== undefined) $set.language = String(language).trim();
        if (extraInfo !== undefined) $set.extraInfo = String(extraInfo).trim();
        if (password !== undefined && String(password).length >= 8) {
            if (!isStrongPassword(String(password))) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters and include a letter and a number',
                });
            }
            $set.password = await bcrypt.hash(String(password), 10);
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

module.exports = {
    registerStudent,
    loginStudent,
    loginCompany,
    loginAdmin,
    updateStudentProfile,
    updateCompanyProfile,
    updateAdminProfile,
};
