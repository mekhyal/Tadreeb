const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    jobTitle: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', ''],
      default: '',
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },
    language: {
      type: String,
      default: '',
      trim: true,
    },
    extraInfo: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active'],
      default: 'Active',
    },
    role: {
      type: String,
      default: 'admin',
      immutable: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
