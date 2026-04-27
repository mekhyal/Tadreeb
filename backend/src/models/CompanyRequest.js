const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validators');

const companyRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true, maxlength: 200 },
    industry: { type: String, required: true, trim: true, maxlength: 100 },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: [100, 'officialEmail is too long'],
      match: [EMAIL_REGEX, 'Invalid email format'],
    },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 20 },
    website: { type: String, default: '', trim: true, maxlength: 200 },
    companySize: { type: String, required: true, trim: true, maxlength: 50 },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    foundedYear: { type: String, default: '', trim: true, maxlength: 4 },
    contactPerson: { type: String, required: true, trim: true, maxlength: 100 },
    companyDescription: { type: String, required: true, trim: true, maxlength: 2000 },
    joinReason: { type: String, required: true, trim: true, maxlength: 2000 },
    confirmInfo: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyRequest', companyRequestSchema);
