const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
    createAdmin,
    createCompany,
    getStudents,
    getCompanies,
    getAdmins,
    updateCompanyStatus,
} = require('../controllers/adminController');

router.post('/create-admin', createAdmin);

router.post('/create-company', protect, allowRoles('admin'), createCompany);
router.get('/students', protect, allowRoles('admin'), getStudents);
router.get('/companies', protect, allowRoles('admin'), getCompanies);
router.get('/admins', protect, allowRoles('admin'), getAdmins);
router.get('/companies/:id/status', protect, allowRoles('admin'), updateCompanyStatus);

module.exports = router;