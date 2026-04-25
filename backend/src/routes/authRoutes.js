const express = require('express');
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getStudents,
    loginCompany,
    getCompany,
    loginAdmin,
    getAdmins
} = require('../controllers/authController');

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.post('/company/login', loginCompany);
router.post('/admin/login', loginAdmin);

// Get routes
router.get('/students', getStudents);
router.get('/companies', getCompany);
router.get('/admins', getAdmins);

module.exports = router;