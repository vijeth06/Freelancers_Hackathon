const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [1000, 'Task description cannot exceed 1000 characters'],
    },
    owner: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    deadline: {
      type: String,
      default: 'Not specified',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  { _id: true }
);

const editHistorySchema = new mongoose.Schema(
  {
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    editedAt: {
      type: Date,
      default: Date.now,
    },
    changeDescription: {
      type: String,
      trim: true,
    },
    previousData: {
      summary: String,
      keyPoints: [String],
      actionItems: [actionItemSchema],
    },
  },
  { _id: true }
);

const analysisSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: [true, 'Meeting ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [5000, 'Summary cannot exceed 5000 characters'],
    },
    keyPoints: {
      type: [String],
      required: [true, 'Key points are required'],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one key point is required',
      },
    },
    actionItems: {
      type: [actionItemSchema],
      default: [],
    },
    aiModel: {
      type: String,
      trim: true,
    },
    aiPromptTokens: {
      type: Number,
    },
    aiCompletionTokens: {
      type: Number,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: {
      type: [editHistorySchema],
      default: [],
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

analysisSchema.index({ meetingId: 1, version: -1 });
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ 'actionItems.status': 1 });
analysisSchema.index({ 'actionItems.owner': 1 });
analysisSchema.index({ 'actionItems.priority': 1 });
analysisSchema.index({ 'actionItems.deadline': 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
