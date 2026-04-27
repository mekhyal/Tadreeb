const Opportunity = require('../models/Opportunity');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { isValidObjectId } = require('../utils/validators');
const { companyMayUsePortal } = require('../utils/companyAccountStatus');

const createOpportunity = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            rules,
            qualifications,
            location,
            seats,
            dateFrom,
            dateTo,
            imageURL,
          } = req.body;

          if(!title || !description || !location || !seats || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill required program fields' });
          }

          // gate posting on the company's admin-controlled status (rejected/pending companies cannot post)
          const company = await Company.findById(req.user.id).select('status companyName');
          if (!company) {
            return res.status(404).json({ message: 'Company account not found' });
          }
          if (!companyMayUsePortal(company.status)) {
            return res.status(403).json({
              message: `Company is not allowed to post programs (status: ${company.status})`,
            });
          }

          // parse and validate dates: reject malformed values, past start dates, and reversed ranges
          const start = new Date(dateFrom);
          const end = new Date(dateTo);

          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid dateFrom or dateTo format' });
          }

          // compare against the start of today so a program starting today is still allowed
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (start < today) {
            return res.status(400).json({ message: 'dateFrom cannot be in the past' });
          }

          if (end <= start) {
            return res.status(400).json({ message: 'dateTo must be after dateFrom' });
          }

          // duplicate-listing guard: same company, same title, same date range = duplicate
          const duplicate = await Opportunity.findOne({
            companyID: req.user.id,
            title: title.trim(),
            dateFrom: start,
            dateTo: end,
          });
          if (duplicate) {
            return res.status(400).json({
              message: 'A program with the same title and date range already exists',
            });
          }

          const opportunity = await Opportunity.create({
            title,
            subtitle,
            description,
            rules,
            qualifications: typeof qualifications === 'string' ? qualifications.trim() : '',
            location,
            seats,
            dateFrom: start,
            dateTo: end,
            imageURL,
            companyID: req.user.id,
          });

          return res.status(201).json({
            message: 'program created successfully',
            opportunity,
          });
    }catch (error){
        // mongoose validation errors should be 400, not 500
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({ message: 'Duplicate program' });
        }
        return res.status(500).json({message: error.message});
    }
};

// get all oppurtunities
// Seats shown to students = capacity minus *accepted* interns only (applications do not hold a seat until accepted).
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate(
      'companyID',
      'companyName email industry location'
    );

    const viewer = req.user;

    const result = await Promise.all(
      opportunities.map(async (program) => {
        const acceptedCount = await Application.countDocuments({
          programID: program._id,
          status: 'Accepted',
        });

        const companyIdRaw = program.companyID?._id || program.companyID;
        const isAdmin = viewer?.role === 'admin';
        const isOwnerCompany =
          viewer?.role === 'company' &&
          companyIdRaw &&
          String(companyIdRaw) === String(viewer.id);

        const row = {
          ...program.toObject(),
          usedSeats: acceptedCount,
          availableSeats: Math.max(0, program.seats - acceptedCount),
        };

        if (isAdmin || isOwnerCompany) {
          row.applicantsCount = await Application.countDocuments({ programID: program._id });
        }

        return row;
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get oppurtunity by id
// added seats tracking for single program view as well (Abdulaziz)
const getOpportunityById = async (req, res) => {
  try {
    // validate ObjectId shape up front so malformed ids don't blow up Mongoose
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const opportunity = await Opportunity.findById(req.params.id).populate(
      'companyID',
      'companyName email industry location'
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const acceptedCount = await Application.countDocuments({
      programID: opportunity._id,
      status: 'Accepted',
    });

    const companyIdRaw = opportunity.companyID?._id || opportunity.companyID;
    const viewer = req.user;
    const isAdmin = viewer?.role === 'admin';
    const isOwnerCompany =
      viewer?.role === 'company' &&
      companyIdRaw &&
      String(companyIdRaw) === String(viewer.id);

    const row = {
      ...opportunity.toObject(),
      usedSeats: acceptedCount,
      availableSeats: Math.max(0, opportunity.seats - acceptedCount),
    };

    if (isAdmin || isOwnerCompany) {
      row.applicantsCount = await Application.countDocuments({ programID: opportunity._id });
    }

    return res.status(200).json(row);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update the opportunity — do not allow seats below accepted count
const updateOpportunity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const isOwnerCompany = opportunity.companyID.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwnerCompany && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to update this program' });
    }

    // if the update touches dates, re-validate the resulting range
    const nextStart = req.body.dateFrom ? new Date(req.body.dateFrom) : opportunity.dateFrom;
    const nextEnd = req.body.dateTo ? new Date(req.body.dateTo) : opportunity.dateTo;
    if (Number.isNaN(nextStart.getTime()) || Number.isNaN(nextEnd.getTime())) {
      return res.status(400).json({ message: 'Invalid dateFrom or dateTo format' });
    }
    if (nextEnd <= nextStart) {
      return res.status(400).json({ message: 'dateTo must be after dateFrom' });
    }

    const acceptedCount = await Application.countDocuments({
      programID: req.params.id,
      status: 'Accepted',
    });

    if (
      req.body.seats !== undefined &&
      Number(req.body.seats) < acceptedCount
    ) {
      return res.status(400).json({
        message: `Seats cannot be less than accepted participants (${acceptedCount})`,
      });
    }

    const updatedData = {
      ...req.body,
    };

    // re-activate a Completed program if seats are being increased above current accepted usage
    if (
      updatedData.seats !== undefined &&
      Number(updatedData.seats) > acceptedCount &&
      opportunity.status === 'Completed'
    ) {
      updatedData.status = 'Active';
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('companyID', 'companyName email industry location');

    return res.status(200).json({
      message: 'Program updated successfully',
      opportunity: updatedOpportunity,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

  // delete oppurtunity
  const deleteOpportunity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const isOwnerCompany = opportunity.companyID.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwnerCompany && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this program' });
    }

    await opportunity.deleteOne();

    return res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  module.exports = {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity,
  };
