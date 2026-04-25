const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');

// create Admin account
const createAdmin = async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
  
      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ message: 'Please fill all required fields' });
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
      });
  
      return res.status(201).json({
        message: 'Admin created successfully',
        admin,
      });
    } catch (error) {
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
    
        // check if exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
          return res.status(400).json({ message: 'Student already exists' });
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

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
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