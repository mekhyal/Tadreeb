const Opportunity = require('../models/Opportunity');

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
const getOpportunities = async (req, res) => {
    try {
      const opportunities = await Opportunity.find().populate(
        'companyID',
        'companyName email industry location'
      );
  
      return res.status(200).json(opportunities);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

// get opputunity by the ID
const getOpportunityById = async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id).populate(
        'companyID',
        'companyName email industry location'
      );
  
      if (!opportunity) {
        return res.status(404).json({ message: 'Program not found' });
      }
  
      return res.status(200).json(opportunity);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

// update the oppurtunity
const updateOpportunity = async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);
  
      if (!opportunity) {
        return res.status(404).json({ message: 'Program not found' });
      }
  
      if (opportunity.companyID.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not allowed to update this program' });
      }
  
      const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
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
  
      if (opportunity.companyID.toString() !== req.user.id) {
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