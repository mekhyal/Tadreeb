const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validators');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'companyName is too long'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, 'email is too long'],
      match: [EMAIL_REGEX, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'password must be at least 8 characters'],
      select: false,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'industry is too long'],
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
    contactPerson: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'contactPerson is too long'],
    },
    website: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'website is too long'],
      validate: {
        validator: (v) => !v || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v),
        message: 'Invalid website',
      },
    },
    size: {
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
      min: [1800, 'foundedYear must be 1800 or later'],
      validate: {
        validator: function (value) {
          if (value === undefined || value === null) return true;
          return value <= new Date().getFullYear();
        },
        message: 'foundedYear cannot be in the future',
      },
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'description is too long'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Inactive', 'Rejected'],
      default: 'Pending',
    },
    role: {
      type: String,
      default: 'company',
      immutable: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);