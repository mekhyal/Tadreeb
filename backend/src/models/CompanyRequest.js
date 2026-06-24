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

    commercialLicenseNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'commercialLicenseNo is too long'],
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: [8, 'contactNumber is too long'],
      match: [/^[9654]\d{7}$/, 'Invalid Kuwait mobile number'],
    },

    website: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'website is too long'],
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v);
        },
        message: 'Invalid website',
      },
    },
    
    companySize: {
      type: String,
      required: true,
      enum: ['1-10', '11-50', '51-100', '101-200', '201-500', '500+'],
    },
    
    headOfficeLocation: {
      type: String,
      required: true,
      enum: ['Al Asimah', 'Hawalli', 'Farwaniya', 'Mubarak Al-Kabeer', 'Ahmadi', 'Jahra'],
    },
    
    foundedYear: {
      type: Number,
      required: true,
      min: [1900, 'Invalid year'],
      max: [2099, 'Invalid year'],
    },
    
    companyDescription: { type: String, required: true, trim: true, maxlength: 2000 },
    
    joinReason: { type: String, required: true, trim: true, maxlength: 2000 },
    
    
    confirmInfo: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v) => v === true,
        message: 'You must confirm the information is accurate',
      },
    },
    
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyRequest', companyRequestSchema);