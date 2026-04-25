const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

// public reads
router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);

// company creates programs
router.post('/', protect, allowRoles('company'), createOpportunity);

// company or admin can update/delete
router.put('/:id', protect, allowRoles('company', 'admin'), updateOpportunity);
router.delete('/:id', protect, allowRoles('company', 'admin'), deleteOpportunity);

module.exports = router;