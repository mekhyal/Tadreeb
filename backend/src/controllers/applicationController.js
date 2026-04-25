const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// apply to opportunity
const applyToProgram = async (req, res) => {
  try {
    const { programID } = req.body;

    if (!programID) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    const program = await Opportunity.findById(programID);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const existingApplication = await Application.findOne({
      studentID: req.user.id,
      programID,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You already applied to this program' });
    }

    const application = await Application.create({
      studentID: req.user.id,
      programID,
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get logged-in student's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentID: req.user.id })
      .populate('programID')
      .populate('studentID', 'firstName lastName email major');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get all applications for the logged-in company's programs
const getCompanyApplications = async (req, res) => {
  try {
    const programs = await Opportunity.find({ companyID: req.user.id }).select('_id');
    const programIds = programs.map((program) => program._id);

    const applications = await Application.find({
      programID: { $in: programIds },
    })
      .populate('studentID', 'firstName lastName email major universityName skills')
      .populate('programID', 'title location dateFrom dateTo');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// company updates an application's status (only for its own program)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, decisionNote } = req.body;

    const application = await Application.findById(req.params.id).populate('programID');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.programID.companyID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this application' });
    }

    application.status = status || application.status;
    application.decisionNote = decisionNote || application.decisionNote;

    await application.save();

    return res.status(200).json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToProgram,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
};
