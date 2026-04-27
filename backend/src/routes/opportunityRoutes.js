const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

// public reads (optional Bearer for company-only metrics)
router.get('/', optionalAuth, getOpportunities);
router.get('/:id', optionalAuth, getOpportunityById);

// company creates programs
router.post('/', protect, allowRoles('company'), createOpportunity);

// company or admin can update/delete
router.put('/:id', protect, allowRoles('company', 'admin'), updateOpportunity);
router.delete('/:id', protect, allowRoles('company', 'admin'), deleteOpportunity);

module.exports = router;