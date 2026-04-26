const CompanyRequest = require('../models/CompanyRequest');
const { isValidEmail } = require('../utils/validators');

const isPlainString = (v) => typeof v === 'string';

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

    if (!isValidEmail(officialEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!confirmInfo) {
      return res.status(400).json({ message: 'You must confirm the information is correct' });
    }

    const request = await CompanyRequest.create({
      companyName: companyName.trim(),
      industry: industry.trim(),
      officialEmail: officialEmail.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      website: typeof website === 'string' ? website.trim() : '',
      companySize: companySize.trim(),
      location: location.trim(),
      foundedYear: typeof foundedYear === 'string' ? foundedYear.trim() : '',
      contactPerson: contactPerson.trim(),
      companyDescription: companyDescription.trim(),
      joinReason: joinReason.trim(),
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
