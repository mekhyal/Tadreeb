const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const generationToken = require('../utils/generateToken');
const { token } = require('morgan');


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
            message: 'Please all required student fields',
        });
    }

    const existingStudent = await Student.findOne({ email });
    if(existingStudent){
        return res.status(400).json({message: 'Student already exists'});
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

    res.status(201).json({
        message: 'Student registered successfully',
        token: generationToken(student._id, student.role),
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
        res.status(500).json({ message: error.message});
    }
};

// Student login
const loginStudent = async (req,res) => {
    try{
        const {email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student){
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password'});
        }

        res.status(200).json({
            message: 'Student login successful',
            token: generationToken(student._id, student.role),
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

    } catch(error){
        res.status(500).json({ message: error.message});
    }
};

// company Login
const loginCompany = async (req,res) => {
    try{
        const {email,password} = req.body;

        const company = await Company.findOne({email});
        if(!company){
            res.status(400).json({message: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if(!isMatch){
            res.status(400).json({message: 'Invalid email or password'});

            res.status(200).json({
                message: 'Company login successful',
                token: generationToken(company._id,  company.role),
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
    } 
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Admin login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if(!admin){
            res.status(400).json({ message: 'Inavlid email or password'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch)
        {
            res.status(400).json({ message: 'Invalid email or password'});
        }

        res.status(200).json({
            message: 'Admin login successful',
            token: generationToken(admin._id, admin.role),
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
                role: admin.role,
            },
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    loginCompany,
    loginAdmin,
};