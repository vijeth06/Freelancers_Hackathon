const Analysis = require('../models/Analysis');
const Meeting = require('../models/Meeting');
const aiService = require('../services/aiService');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class AnalysisController {
  async generate(req, res, next) {
    try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findOne({ _id: meetingId, userId: req.userId });
      if (!meeting) {
        throw ApiError.notFound('Meeting not found');
      }

      const existingCount = await Analysis.countDocuments({ meetingId });

      const { analysis, metadata } = await aiService.analyzeMeeting(
        meeting.rawContent,
        meeting.type
      );

      const newAnalysis = new Analysis({
        meetingId,
        userId: req.userId,
        version: existingCount + 1,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        actionItems: analysis.actionItems,
        aiModel: metadata.model,
        aiPromptTokens: metadata.promptTokens,
        aiCompletionTokens: metadata.completionTokens,
        generatedAt: new Date(),
      });

      await newAnalysis.save();
      logger.info(`Analysis generated for meeting ${meetingId}, version ${newAnalysis.version}`);

      res.status(201).json({
        success: true,
        data: newAnalysis,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLatest(req, res, next) {
    try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findOne({ _id: meetingId, userId: req.userId });
      if (!meeting) {
        throw ApiError.notFound('Meeting not found');
      }

      const analysis = await Analysis.findOne({ meetingId }).sort({ version: -1 });
      if (!analysis) {
        throw ApiError.notFound('No analysis found for this meeting');
      }

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req, res, next) {
    try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findOne({ _id: meetingId, userId: req.userId });
      if (!meeting) {
        throw ApiError.notFound('Meeting not found');
      }

      const analyses = await Analysis.find({ meetingId })
        .sort({ version: -1 })
        .select('version generatedAt isEdited aiModel createdAt');

      res.json({
        success: true,
        data: analyses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByVersion(req, res, next) {
    try {
      const { meetingId, version } = req.params;

      const meeting = await Meeting.findOne({ _id: meetingId, userId: req.userId });
      if (!meeting) {
        throw ApiError.notFound('Meeting not found');
      }

      const analysis = await Analysis.findOne({
        meetingId,
        version: parseInt(version, 10),
      });
      if (!analysis) {
        throw ApiError.notFound('Analysis version not found');
      }

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { analysisId } = req.params;

      const analysis = await Analysis.findOne({ _id: analysisId, userId: req.userId });
      if (!analysis) {
        throw ApiError.notFound('Analysis not found');
      }

      const previousData = {
        summary: analysis.summary,
        keyPoints: [...analysis.keyPoints],
        actionItems: analysis.actionItems.map((item) => item.toObject()),
      };

      if (req.body.summary !== undefined) analysis.summary = req.body.summary;
      if (req.body.keyPoints !== undefined) analysis.keyPoints = req.body.keyPoints;
      if (req.body.actionItems !== undefined) analysis.actionItems = req.body.actionItems;

      analysis.isEdited = true;
      analysis.editHistory.push({
        editedBy: req.userId,
        editedAt: new Date(),
        changeDescription: req.body.changeDescription || 'Manual edit',
        previousData,
      });

      await analysis.save();
      logger.info(`Analysis ${analysisId} updated by user ${req.userId}`);

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirm(req, res, next) {
    try {
      const { analysisId } = req.params;

      const analysis = await Analysis.findOne({ _id: analysisId, userId: req.userId });
      if (!analysis) {
        throw ApiError.notFound('Analysis not found');
      }

      analysis.confirmedAt = new Date();
      analysis.confirmedBy = req.userId;
      await analysis.save();

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEditHistory(req, res, next) {
    try {
      const { analysisId } = req.params;

      const analysis = await Analysis.findOne({ _id: analysisId, userId: req.userId })
        .select('editHistory version')
        .populate('editHistory.editedBy', 'name email');

      if (!analysis) {
        throw ApiError.notFound('Analysis not found');
      }

      res.json({
        success: true,
        data: analysis.editHistory,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalysisController();
