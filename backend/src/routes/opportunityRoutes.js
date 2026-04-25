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

// company-only writes
router.post('/', protect, allowRoles('company'), createOpportunity);
router.put('/:id', protect, allowRoles('company'), updateOpportunity);
router.delete('/:id', protect, allowRoles('company'), deleteOpportunity);

module.exports = router;
