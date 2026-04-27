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
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'industry is too long'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, 'phone is too long'],
    },
    website: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'website is too long'],
    },
    size: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'size is too long'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'location is too long'],
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
    contactPerson: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'contactPerson is too long'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'description is too long'],
    },
    joinReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'joinReason is too long'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Rejected'],
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