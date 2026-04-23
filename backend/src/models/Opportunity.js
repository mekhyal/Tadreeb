const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rules: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    imageURL: {
      type: String,
      default: '',
      trim: true,
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);