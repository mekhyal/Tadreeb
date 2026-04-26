const express = require('express');
const router = express.Router();
const { createCompanyRequest } = require('../controllers/companyRequestController');

// No auth — public form from the marketing site
router.post('/', createCompanyRequest);

module.exports = router;
