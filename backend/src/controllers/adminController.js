const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const {
  isValidEmail,
  isStrongPassword,
  isValidObjectId,
} = require('../utils/validators');

// company status values that admins are allowed to set
const COMPANY_STATUS_VALUES = ['Pending', 'Review', 'Approved', 'Rejected', 'Active'];

// create Admin account
const createAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      jobTitle,
      gender,
      country,
      language,
      extraInfo,
      status,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include a letter and a number',
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      jobTitle,
      gender,
      country,
      language,
      extraInfo,
      status: status || 'Active',
    });

    return res.status(201).json({
      message: 'Admin created successfully',
      admin,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

  //create company
  const createCompany = async (req, res) => {
    try {
      const {
        companyName,
        email,
        password,
        industry,
        phone,
        website,
        size,
        location,
        foundedYear,
        contactPerson,
        description,
        joinReason,
        status,
      } = req.body;
  
      if (!companyName || !email || !password || !industry || !phone || !location) {
        return res.status(400).json({ message: 'Please fill required company fields' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters and include a letter and a number',
        });
      }

      // foundedYear must be a real year and not in the future
      if (foundedYear !== undefined && foundedYear !== null && foundedYear !== '') {
        const yearNum = Number(foundedYear);
        const currentYear = new Date().getFullYear();
        if (!Number.isInteger(yearNum) || yearNum < 1800 || yearNum > currentYear) {
          return res.status(400).json({
            message: `foundedYear must be an integer between 1800 and ${currentYear}`,
          });
        }
      }

      // if admin specifies a status, it must be one of the allowed enum values
      if (status !== undefined && !COMPANY_STATUS_VALUES.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed values: ${COMPANY_STATUS_VALUES.join(', ')}`,
        });
      }

      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const company = await Company.create({
        companyName,
        email,
        password: hashedPassword,
        industry,
        phone,
        website,
        size,
        location,
        foundedYear,
        contactPerson,
        description,
        joinReason,
        status: status || 'Approved',
      });
  
      return res.status(201).json({
        message: 'Company created successfully',
        company,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Company already exists' });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };


  // create student
  const createStudent = async (req, res) => {
    try {
        const {
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
    
        // validation
        if (
          !universityID ||
          !firstName ||
          !lastName ||
          !email ||
          !password
        ) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!isValidEmail(email)) {
          return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!isStrongPassword(password)) {
          return res.status(400).json({
            message: 'Password must be at least 8 characters and include a letter and a number',
          });
        }
    
        // check if exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
          return res.status(400).json({ message: 'Student already exists' });
        }
        const existingByUniId = await Student.findOne({ universityID });
        if (existingByUniId) {
          return res.status(400).json({ message: 'University ID already registered' });
        }
    
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // create student
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
          skills,
          role: 'student',
          status: 'active',
        });
    
        return res.status(201).json({
          message: 'Student created by admin successfully',
          student,
        });
    
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: 'Student already exists' });
        }
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
  }

  // get students
  const getStudents = async (req,res) => {
    try {
        const students = await Student.find().select('-password');
        return res.status(200).json(students);
    }catch (error){
        return res.status(500).json({ message: error.message });
    }
  };

  // get all companies
  const getCompanies = async (req,res) => {
    try {
        const companies = await Company.find().select('-password');
        return res.status(200).json(companies);
    } catch(error){
        return res.status(500).json({message: error.message});
    }
  };

// get admins 
const getAdmins = async (req,res) => {
    try {
        const admins = await Admin.find().select('-password');
        return res.status(200).json(admins);
    }
    catch (error){
        return res.status(500).json({message: error.message});
    }
};

// update company
const updateCompanyStatus = async (req,res) => {
    try { 
        const {status} = req.body;

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid company ID' });
        }

        if (!status || !COMPANY_STATUS_VALUES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${COMPANY_STATUS_VALUES.join(', ')}`,
            });
        }

        // runValidators ensures the enum on the schema is enforced as well
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).select('-password');

        if(!company){
            return res.status(404).json({ message: 'Company not found '});
        }

        return res.status(200).json({
            message: 'Company status updated',
            company,
        });
    }
    catch(error){
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({message: error.message });
    }
}

module.exports = {
    createAdmin,
    createCompany,
    createStudent,
    getStudents,
    getCompanies,
    getAdmins,
    updateCompanyStatus,
};