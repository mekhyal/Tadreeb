const CompanyRequest = require('../models/CompanyRequest');
const {
  isValidEmail,
  exceedsMaxLength,
  MAX_LONG_TEXT,
} = require('../utils/validators');

const isPlainString = (v) => typeof v === 'string';

// Max lengths must match `models/CompanyRequest.js`
const LIMIT = {
  companyName: 200,
  industry: 100,
  email: 100,
  phoneNumber: 20,
  website: 200,
  companySize: 50,
  location: 100,
  foundedYear: 4,
  contactPerson: 100,
  companyDescription: MAX_LONG_TEXT,
  joinReason: MAX_LONG_TEXT,
};

// Public: company applies to join the platform (no auth)
const createCompanyRequest = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      officialEmail,
      phoneNumber,
      website,
      companySize,
      location,
      foundedYear,
      contactPerson,
      companyDescription,
      joinReason,
      confirmInfo,
    } = req.body;

    if (
      !companyName ||
      !industry ||
      !officialEmail ||
      !phoneNumber ||
      !companySize ||
      !location ||
      !contactPerson ||
      !companyDescription ||
      !joinReason
    ) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (
      ![
        companyName,
        industry,
        officialEmail,
        phoneNumber,
        companySize,
        location,
        contactPerson,
        companyDescription,
        joinReason,
      ].every(isPlainString)
    ) {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    if (website !== undefined && website !== null && !isPlainString(website)) {
      return res.status(400).json({ message: 'Invalid website format' });
    }

    if (!isValidEmail(officialEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!confirmInfo) {
      return res.status(400).json({ message: 'You must confirm the information is correct' });
    }

    const foundedYearRaw =
      foundedYear == null || foundedYear === '' ? '' : String(foundedYear).trim();
    if (foundedYearRaw !== '') {
      const yearNum = Number(foundedYearRaw);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(yearNum) || yearNum < 1800 || yearNum > currentYear) {
        return res.status(400).json({
          message: `Founded year must be between 1800 and ${currentYear}`,
        });
      }
    }

    const trimCompanyName = companyName.trim();
    const trimIndustry = industry.trim();
    const trimEmail = officialEmail.trim().toLowerCase();
    const trimPhone = phoneNumber.trim();
    const trimWebsite = isPlainString(website) ? website.trim() : '';
    const trimSize = companySize.trim();
    const trimLocation = location.trim();
    const trimFounded = foundedYearRaw;
    const trimContact = contactPerson.trim();
    const trimDescription = companyDescription.trim();
    const trimJoinReason = joinReason.trim();

    if (
      !trimCompanyName ||
      !trimIndustry ||
      !trimEmail ||
      !trimPhone ||
      !trimSize ||
      !trimLocation ||
      !trimContact ||
      !trimDescription ||
      !trimJoinReason
    ) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const lengthChecks = [
      ['companyName', trimCompanyName, LIMIT.companyName],
      ['industry', trimIndustry, LIMIT.industry],
      ['officialEmail', trimEmail, LIMIT.email],
      ['phoneNumber', trimPhone, LIMIT.phoneNumber],
      ['website', trimWebsite, LIMIT.website],
      ['companySize', trimSize, LIMIT.companySize],
      ['location', trimLocation, LIMIT.location],
      ['foundedYear', trimFounded, LIMIT.foundedYear],
      ['contactPerson', trimContact, LIMIT.contactPerson],
      ['companyDescription', trimDescription, LIMIT.companyDescription],
      ['joinReason', trimJoinReason, LIMIT.joinReason],
    ];

    const tooLong = lengthChecks.find(([, val, max]) => exceedsMaxLength(val, max));
    if (tooLong) {
      return res.status(400).json({
        message: `${tooLong[0]} exceeds maximum length of ${tooLong[2]} characters`,
      });
    }

    // Persist every field defined on the CompanyRequest schema (timestamps add createdAt / updatedAt).
    const request = await CompanyRequest.create({
      companyName: trimCompanyName,
      industry: trimIndustry,
      officialEmail: trimEmail,
      phoneNumber: trimPhone,
      website: trimWebsite,
      companySize: trimSize,
      location: trimLocation,
      foundedYear: trimFounded,
      contactPerson: trimContact,
      companyDescription: trimDescription,
      joinReason: trimJoinReason,
      confirmInfo: !!confirmInfo,
      status: 'Pending',
    });

    return res.status(201).json({
      message: 'Request submitted successfully',
      request: {
        id: request._id,
        status: request.status,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompanyRequest,
};
