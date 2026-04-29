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
  getAdminApplications,
  reviewAdminApplication,
} = require('../controllers/adminController');

router.post('/create-admin', protect, allowRoles('admin'), createAdmin);
router.post('/create-student', protect, allowRoles('admin'), createStudent);
router.post('/create-company', protect, allowRoles('admin'), createCompany);

router.get('/students', protect, allowRoles('admin'), getStudents);
router.get('/companies', protect, allowRoles('admin'), getCompanies);
router.get('/admins', protect, allowRoles('admin'), getAdmins);

router.put('/companies/:id/status', protect, allowRoles('admin'), updateCompanyStatus);
router.put('/students/:id/status', protect, allowRoles('admin'), updateStudentStatus);

router.get('/applications', protect, allowRoles('admin'), getAdminApplications);
router.put('/applications/:id/review', protect, allowRoles('admin'), reviewAdminApplication);

module.exports = router;
