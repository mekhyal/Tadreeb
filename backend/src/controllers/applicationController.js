const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// Apply to opportunity (Abdulaziz)
// What happens when a student applies to a program:
// 1. Checks program exists
// 2. Blocks completed programs
// 3. Blocks duplicate application
// 4. Counts active applications
// 5. Blocks if seats are full
// 6. Creates application
// 7. Marks program Completed when last seat is taken
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

    if (program.status === 'Completed') {
      return res.status(400).json({ message: 'This program is already full or completed' });
    }

    const existingApplication = await Application.findOne({
      studentID: req.user.id,
      programID,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You already applied to this program' });
    }

    const activeApplicationsCount = await Application.countDocuments({
      programID,
      status: { $in: ['Submitted', 'Under Review', 'Accepted'] },
    });

    if (activeApplicationsCount >= program.seats) {
      program.status = 'Completed';
      await program.save();

      return res.status(400).json({ message: 'No seats available for this program' });
    }

    const application = await Application.create({
      studentID: req.user.id,
      programID,
    });

    if (activeApplicationsCount + 1 >= program.seats) {
      program.status = 'Completed';
      await program.save();
    }

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
      .populate('studentID', 'firstName lastName email major universityName year skills')
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

// student cancel/remove application (Abdulaziz)
const cancelApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.studentID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to cancel this application' });
    }

    await application.deleteOne();

    return res.status(200).json({
      message: 'Application removed successfully',
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
  cancelApplication,
};