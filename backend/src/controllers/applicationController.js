const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { isValidObjectId } = require('../utils/validators');

// statuses that count toward "seat occupied" / "student enrolled"
const ACCEPTED_STATUSES = ['Accepted'];
// statuses a student is allowed to cancel from (Accepted/Rejected are final per spec)
const CANCELLABLE_STATUSES = new Set(['Submitted', 'Under Review']);

// Apply to opportunity (Abdulaziz)
// What happens when a student applies to a program:
// 1. Checks program exists
// 2. Blocks completed programs
// 3. Blocks duplicate application
// 4. Enforces seat capacity (accepted applicants only)
// 5. Blocks overlapping accepted enrollments
// 6. Creates application
const applyToProgram = async (req, res) => {
  try {
    const { programID } = req.body;

    if (!programID) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    if (!isValidObjectId(programID)) {
      return res.status(400).json({ message: 'Invalid program ID' });
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

    // seat-capacity guard: count accepted applicants and reject if program is full
    const acceptedCount = await Application.countDocuments({
      programID,
      status: { $in: ACCEPTED_STATUSES },
    });
    if (acceptedCount >= program.seats) {
      program.status = 'Completed';
      await program.save();
      return res.status(400).json({ message: 'No seats available for this program' });
    }

    // overlap guard: a student already accepted into a program with overlapping dates
    // should not be able to apply to another time-conflicting program
    const overlappingAccepted = await Application.findOne({
      studentID: req.user.id,
      status: { $in: ACCEPTED_STATUSES },
    }).populate('programID', 'dateFrom dateTo title');

    if (overlappingAccepted && overlappingAccepted.programID) {
      const a = overlappingAccepted.programID;
      const overlaps =
        a.dateFrom <= program.dateTo && a.dateTo >= program.dateFrom;
      if (overlaps) {
        return res.status(400).json({
          message: `You are already enrolled in "${a.title}" with overlapping dates`,
        });
      }
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
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already applied to this program' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }

    const { status, decisionNote } = req.body;

    const application = await Application.findById(req.params.id).populate('programID');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.programID.companyID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this application' });
    }

    // when accepting, re-check seat capacity to avoid over-allocating in races
    if (status === 'Accepted' && application.status !== 'Accepted') {
      const acceptedCount = await Application.countDocuments({
        programID: application.programID._id,
        status: 'Accepted',
      });
      if (acceptedCount >= application.programID.seats) {
        return res.status(400).json({
          message: 'Cannot accept: no seats available for this program',
        });
      }
    }

    application.status = status || application.status;
    application.decisionNote = decisionNote || application.decisionNote;

    await application.save();

    return res.status(200).json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// student cancels (deletes) their own application — only allowed before final decision
const cancelApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.studentID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to cancel this application' });
    }

    if (!CANCELLABLE_STATUSES.has(application.status)) {
      return res.status(400).json({
        message: `Cannot cancel an application with status "${application.status}"`,
      });
    }

    await application.deleteOne();

    return res.status(200).json({ message: 'Application cancelled successfully' });
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
