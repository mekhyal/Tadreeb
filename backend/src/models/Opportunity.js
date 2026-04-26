const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'title is too long'],
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'subtitle is too long'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [5000, 'description is too long'],
    },
    rules: {
      type: String,
      default: '',
      trim: true,
      maxlength: [5000, 'rules is too long'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'location is too long'],
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
      maxlength: [500, 'imageURL is too long'],
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

// dateTo must be strictly after dateFrom (cross-field validator)
opportunitySchema.pre('validate', function (next) {
  if (this.dateFrom && this.dateTo && this.dateTo <= this.dateFrom) {
    return next(new Error('dateTo must be after dateFrom'));
  }
  next();
});

// uniqueness for a (companyID, title, dateFrom, dateTo) tuple to prevent duplicate listings
opportunitySchema.index(
  { companyID: 1, title: 1, dateFrom: 1, dateTo: 1 },
  { unique: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);