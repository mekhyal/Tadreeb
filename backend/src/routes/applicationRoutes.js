const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
  applyToProgram,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
  cancelApplication,
} = require('../controllers/applicationController');

router.post('/', protect, allowRoles('student'), applyToProgram);
router.get('/my', protect, allowRoles('student'), getMyApplications);

// student cancel/remove application (Abdulaziz)
router.delete('/:id', protect, allowRoles('student'), cancelApplication);

router.get('/company', protect, allowRoles('company'), getCompanyApplications);
router.patch('/:id/status', protect, allowRoles('company'), updateApplicationStatus);

module.exports = router;
