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
      maxlength: [1000, 'decisionNote is too long'],
    },
    // Admin platform review (separate from company decision in `status`)
    adminStatus: {
      type: String,
      enum: ['Review', 'Accepted', 'Rejected'],
      default: 'Review',
    },
    adminNote: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'adminNote is too long'],
    },
    visibleToStudent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// hard guarantee at the DB level that a student can't apply twice to the same program
applicationSchema.index({ studentID: 1, programID: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);