const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    programID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected'],
      default: 'Submitted',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    decisionNote: {
      type: String,
      default: '-',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);