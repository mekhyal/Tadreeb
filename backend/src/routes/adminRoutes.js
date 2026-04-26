const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
  createAdmin,
  createCompany,
  createStudent,
  getStudents,
  getCompanies,
  getAdmins,
  updateCompanyStatus,
  updateStudentStatus,
  updateAdminStatus,
} = require('../controllers/adminController');

router.post('/create-admin', protect, allowRoles('admin'), createAdmin);
router.post('/create-student', protect, allowRoles('admin'), createStudent);
router.post('/create-company', protect, allowRoles('admin'), createCompany);

router.get('/students', protect, allowRoles('admin'), getStudents);
router.get('/companies', protect, allowRoles('admin'), getCompanies);
router.get('/admins', protect, allowRoles('admin'), getAdmins);

router.put('/companies/:id/status', protect, allowRoles('admin'), updateCompanyStatus);
router.put('/students/:id/status', protect, allowRoles('admin'), updateStudentStatus);
router.put('/admins/:id/status', protect, allowRoles('admin'), updateAdminStatus);

module.exports = router;