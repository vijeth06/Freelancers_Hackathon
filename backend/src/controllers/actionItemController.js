const Analysis = require('../models/Analysis');
const Meeting = require('../models/Meeting');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class ActionItemController {
  async listAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        priority,
        owner,
        fromDate,
        toDate,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const userMeetings = await Meeting.find({ userId: req.userId }).select('_id');
      const meetingIds = userMeetings.map((m) => m._id);

      const pipeline = [
        { $match: { meetingId: { $in: meetingIds } } },
        { $sort: { version: -1 } },
        {
          $group: {
            _id: '$meetingId',
            latestAnalysis: { $first: '$$ROOT' },
          },
        },
        { $replaceRoot: { newRoot: '$latestAnalysis' } },
        { $unwind: '$actionItems' },
      ];

      const matchStage = {};
      if (status) matchStage['actionItems.status'] = status;
      if (priority) matchStage['actionItems.priority'] = priority;
      if (owner) matchStage['actionItems.owner'] = { $regex: owner, $options: 'i' };

      if (fromDate || toDate) {
        matchStage['actionItems.deadline'] = {};
        if (fromDate) matchStage['actionItems.deadline'].$gte = fromDate;
        if (toDate) matchStage['actionItems.deadline'].$lte = toDate;
      }

      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      const countPipeline = [...pipeline, { $count: 'total' }];

      const sortField =
        sortBy === 'deadline'
          ? 'actionItems.deadline'
          : sortBy === 'priority'
          ? 'actionItems.priority'
          : sortBy === 'status'
          ? 'actionItems.status'
          : 'createdAt';

      pipeline.push(
        { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
        { $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10) },
        { $limit: parseInt(limit, 10) },
        {
          $lookup: {
            from: 'meetings',
            localField: 'meetingId',
            foreignField: '_id',
            as: 'meeting',
          },
        },
        { $unwind: '$meeting' },
        {
          $project: {
            actionItem: '$actionItems',
            meetingId: '$meetingId',
            meetingTitle: '$meeting.title',
            meetingDate: '$meeting.date',
            analysisId: '$_id',
          },
        }
      );

      const [results, countResult] = await Promise.all([
        Analysis.aggregate(pipeline),
        Analysis.aggregate(countPipeline),
      ]);

      const total = countResult.length > 0 ? countResult[0].total : 0;

      res.json({
        success: true,
        data: {
          actionItems: results,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            pages: Math.ceil(total / parseInt(limit, 10)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActionItem(req, res, next) {
    try {
      const { analysisId, actionItemId } = req.params;

      const analysis = await Analysis.findOne({ _id: analysisId, userId: req.userId });
      if (!analysis) {
        throw ApiError.notFound('Analysis not found');
      }

      const actionItem = analysis.actionItems.id(actionItemId);
      if (!actionItem) {
        throw ApiError.notFound('Action item not found');
      }

      const previousData = {
        summary: analysis.summary,
        keyPoints: [...analysis.keyPoints],
        actionItems: analysis.actionItems.map((item) => item.toObject()),
      };

      const { task, owner, deadline, priority, status } = req.body;
      if (task !== undefined) actionItem.task = task;
      if (owner !== undefined) actionItem.owner = owner;
      if (deadline !== undefined) actionItem.deadline = deadline;
      if (priority !== undefined) actionItem.priority = priority;
      if (status !== undefined) actionItem.status = status;

      analysis.isEdited = true;
      analysis.editHistory.push({
        editedBy: req.userId,
        editedAt: new Date(),
        changeDescription: `Updated action item: ${actionItem.task}`,
        previousData,
      });

      await analysis.save();
      logger.info(`Action item ${actionItemId} updated in analysis ${analysisId}`);

      res.json({
        success: true,
        data: actionItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const userMeetings = await Meeting.find({ userId: req.userId }).select('_id');
      const meetingIds = userMeetings.map((m) => m._id);

      const pipeline = [
        { $match: { meetingId: { $in: meetingIds } } },
        { $sort: { version: -1 } },
        {
          $group: {
            _id: '$meetingId',
            latestAnalysis: { $first: '$$ROOT' },
          },
        },
        { $replaceRoot: { newRoot: '$latestAnalysis' } },
        { $unwind: '$actionItems' },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$actionItems.status', 'Pending'] }, 1, 0] },
            },
            completed: {
              $sum: { $cond: [{ $eq: ['$actionItems.status', 'Completed'] }, 1, 0] },
            },
            highPriority: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$actionItems.priority', 'High'] },
                      { $eq: ['$actionItems.status', 'Pending'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ];

      const [stats] = await Analysis.aggregate(pipeline);
      const totalMeetings = await Meeting.countDocuments({
        userId: req.userId,
        isArchived: false,
      });

      res.json({
        success: true,
        data: {
          totalMeetings,
          actionItems: stats || { total: 0, pending: 0, completed: 0, highPriority: 0 },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActionItemController();
