const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    foundedYear: {
      type: Number,
    },
    contactPerson: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    joinReason: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Review', 'Approved', 'Rejected', 'Active'],
      default: 'Pending',
    },
    role: {
      type: String,
      default: 'company',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);