const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { isValidObjectId } = require('../utils/validators');
const {
  FINAL_APPLICATION_STATUSES,
  getRegistrationDeadline,
  syncAutomaticApplicationStatuses,
} = require('../utils/applicationStatus');

// statuses that count toward "seat occupied" / "student enrolled"
const ACCEPTED_STATUSES = ['Accepted'];

const isRegistrationOpen = (program) => {
  const closesAt = getRegistrationDeadline(program);
  if (!closesAt) return true;
  return closesAt >= new Date();
};

const hasProgramStartedOrCompleted = (program) => {
  if (!program) return false;
  if (program.status === 'Completed') return true;
  if (!program.dateFrom) return false;

  const start = new Date(program.dateFrom);
  if (Number.isNaN(start.getTime())) return false;
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today >= start;
};

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
      return res.status(400).json({ message: 'This program has been completed' });
    }

    if (!isRegistrationOpen(program)) {
      return res.status(400).json({
        message: 'Registration is closed for this program',
      });
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
      return res.status(400).json({ message: 'No seats available for this program' });
    }

    // overlap guard: a student already accepted into a program with overlapping dates
    // should not be able to apply to another time-conflicting program
    const overlappingAccepted = await Application.findOne({
      studentID: req.user.id,
      status: { $in: ACCEPTED_STATUSES },
    }).populate('programID', 'dateFrom dateTo registrationDeadline title');

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
      // nested populate so the student page can show the program's company name
      .populate({
        path: 'programID',
        select: 'title subtitle description location dateFrom dateTo registrationDeadline qualifications seats status companyID',
        populate: {
          path: 'companyID',
          select: 'companyName email industry location',
        },
      })
      .populate('studentID', 'firstName lastName email major')
      .sort({ createdAt: -1 });

    await syncAutomaticApplicationStatuses(applications);

    applications.forEach((application) => {
      if (application.visibleToStudent === false) {
        application.status = 'Under Review';
        application.decisionNote = '-';
      }
    });

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
      .populate('studentID', 'firstName lastName email major universityName universityID year skills')
      .populate('programID', 'title location dateFrom dateTo registrationDeadline seats qualifications status')
      .sort({ createdAt: -1 });

    await syncAutomaticApplicationStatuses(applications);

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

    if (status !== undefined && !FINAL_APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Company decision must be Accepted or Rejected.',
      });
    }

    const application = await Application.findById(req.params.id).populate('programID');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const program = application.programID;
    if (program.companyID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this application' });
    }

    if (hasProgramStartedOrCompleted(program)) {
      return res.status(400).json({
        message:
          'Application status can only be updated before the program starts. This program is already active or completed.',
      });
    }

    const previousStatus = application.status;

    // when accepting, re-check seat capacity to avoid over-allocating in races
    if (status === 'Accepted' && previousStatus !== 'Accepted') {
      const acceptedCount = await Application.countDocuments({
        programID: program._id,
        status: 'Accepted',
      });
      if (acceptedCount >= program.seats) {
        return res.status(400).json({
          message: 'Cannot accept: no seats available for this program',
        });
      }
    }

    application.status = status || application.status;
    // allow clearing the note explicitly (don't drop empty-string updates)
    if (decisionNote !== undefined) {
      application.decisionNote = decisionNote;
    }

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

    const application = await Application.findById(req.params.id).populate('programID');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.studentID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to cancel this application' });
    }

    const program = application.programID;

    if (!isRegistrationOpen(program)) {
      return res.status(400).json({
        message:
          'Registration is closed for this program, so you cannot remove this application yourself. Please contact Tadreeb support and we will help you with the request.',
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
