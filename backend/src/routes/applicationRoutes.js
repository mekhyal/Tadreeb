const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
  applyToProgram,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/', protect, allowRoles('student'), applyToProgram);
router.get('/my', protect, allowRoles('student'), getMyApplications);

router.get('/company', protect, allowRoles('company'), getCompanyApplications);
router.patch('/:id/status', protect, allowRoles('company'), updateApplicationStatus);

module.exports = router;
