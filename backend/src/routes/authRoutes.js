const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
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
} = require('../controllers/authController');

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.post('/company/login', loginCompany);
router.post('/admin/login', loginAdmin);

// Note: list endpoints for students/companies/admins live under /api/admin (protected) only;
// they must not be exposed here without auth (was a data-leak risk).

// Authenticated — read / update own profile
router.get('/student/profile', protect, allowRoles('student'), getStudentProfile);
router.get('/company/profile', protect, allowRoles('company'), getCompanyProfile);
router.get('/admin/profile', protect, allowRoles('admin'), getAdminProfile);

router.put('/student/profile', protect, allowRoles('student'), updateStudentProfile);
router.put('/company/profile', protect, allowRoles('company'), updateCompanyProfile);
router.put('/admin/profile', protect, allowRoles('admin'), updateAdminProfile);

module.exports = router;