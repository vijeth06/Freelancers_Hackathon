const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: [
        'standup',
        'sprint-planning',
        'client-meeting',
        'academic',
        'leadership',
        'general',
      ],
      default: 'general',
    },
    rawContent: {
      type: String,
      required: [true, 'Meeting content is required'],
      immutable: true,
      maxlength: [100000, 'Content cannot exceed 100,000 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    participants: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

meetingSchema.virtual('analyses', {
  ref: 'Analysis',
  localField: '_id',
  foreignField: 'meetingId',
  justOne: false,
});

meetingSchema.virtual('latestAnalysis', {
  ref: 'Analysis',
  localField: '_id',
  foreignField: 'meetingId',
  justOne: true,
  options: { sort: { version: -1 } },
});

meetingSchema.methods.generateShareToken = function () {
  this.shareToken = uuidv4();
  this.isShared = true;
  return this.shareToken;
};

meetingSchema.methods.revokeShareToken = function () {
  this.shareToken = null;
  this.isShared = false;
};

meetingSchema.index({ userId: 1, createdAt: -1 });
meetingSchema.index({ date: -1 });
meetingSchema.index({ tags: 1 });
meetingSchema.index({ type: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
