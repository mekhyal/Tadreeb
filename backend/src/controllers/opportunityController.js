const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

const createOpportunity = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            rules,
            location,
            seats,
            dateFrom,
            dateTo,
            imageURL,
          } = req.body;

          if(!title || !description || !location || !seats || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill required program fields' });
          }

          const opportunity = await Opportunity.create({
            title,
            subtitle,
            description,
            rules,
            location,
            seats,
            dateFrom,
            dateTo,
            imageURL,
            companyID: req.user.id,
          });

          return res.status(201).json({
            message: 'program created successfully',
            opportunity,
          });
    }catch (error){
        return res.status(500).json({message: error.message});
    }
};

// get all oppurtunities
// added usedSeats and availableSeats calculation (Abdulaziz)
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate(
      'companyID',
      'companyName email industry location'
    );

    const result = await Promise.all(
      opportunities.map(async (program) => {
        const activeApplicationsCount = await Application.countDocuments({
          programID: program._id,
          status: { $in: ['Submitted', 'Under Review', 'Accepted'] },
        });

        return {
          ...program.toObject(),
          usedSeats: activeApplicationsCount,
          availableSeats: program.seats - activeApplicationsCount,
        };
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
    const opportunity = await Opportunity.findById(req.params.id).populate(
      'companyID',
      'companyName email industry location'
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const activeApplicationsCount = await Application.countDocuments({
      programID: opportunity._id,
      status: { $in: ['Submitted', 'Under Review', 'Accepted'] },
    });

    return res.status(200).json({
      ...opportunity.toObject(),
      usedSeats: activeApplicationsCount,
      availableSeats: opportunity.seats - activeApplicationsCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update the oppurtunity
// prevent reducing seats below current active applications (Abdulaziz)
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const isOwnerCompany = opportunity.companyID.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwnerCompany && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to update this program' });
    }

    const activeApplicationsCount = await Application.countDocuments({
      programID: req.params.id,
      status: { $in: ['Submitted', 'Under Review', 'Accepted'] },
    });

    if (
      req.body.seats !== undefined &&
      Number(req.body.seats) < activeApplicationsCount
    ) {
      return res.status(400).json({
        message: `Seats cannot be less than current applications (${activeApplicationsCount})`,
      });
    }

    const updatedData = {
      ...req.body,
    };

    if (
      updatedData.seats !== undefined &&
      Number(updatedData.seats) > activeApplicationsCount &&
      opportunity.status === 'Completed'
    ) {
      updatedData.status = 'Active';
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate('companyID', 'companyName email industry location');

    return res.status(200).json({
      message: 'Program updated successfully',
      opportunity: updatedOpportunity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  // delete oppurtunity
  const deleteOpportunity = async (req, res) => {
  try {
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