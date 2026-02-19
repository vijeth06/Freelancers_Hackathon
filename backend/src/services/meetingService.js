const Meeting = require('../models/Meeting');
const Analysis = require('../models/Analysis');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class MeetingService {
  async createMeeting(userId, data) {
    const meeting = new Meeting({
      userId,
      title: data.title,
      type: data.type || 'general',
      rawContent: data.rawContent,
      date: data.date || new Date(),
      participants: data.participants || [],
      tags: data.tags || [],
    });

    await meeting.save();
    logger.info(`Meeting created: ${meeting._id} by user ${userId}`);
    return meeting;
  }

  async getMeetingById(meetingId, userId) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId })
      .populate({
        path: 'latestAnalysis',
      });

    if (!meeting) {
      throw ApiError.notFound('Meeting not found');
    }

    return meeting;
  }

  async getMeetingByShareToken(shareToken) {
    const meeting = await Meeting.findOne({ shareToken, isShared: true });

    if (!meeting) {
      throw ApiError.notFound('Shared meeting not found');
    }

    const analysis = await Analysis.findOne({ meetingId: meeting._id })
      .sort({ version: -1 });

    return { meeting, analysis };
  }

  async listMeetings(userId, filters) {
    const {
      page = 1,
      limit = 20,
      type,
      tag,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      archived = false,
    } = filters;

    const query = { userId, isArchived: archived };

    if (type) query.type = type;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [meetings, total] = await Promise.all([
      Meeting.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Meeting.countDocuments(query),
    ]);

    const meetingIds = meetings.map((m) => m._id);
    const analyses = await Analysis.find({
      meetingId: { $in: meetingIds },
    })
      .sort({ version: -1 })
      .lean();

    const analysisMap = {};
    for (const analysis of analyses) {
      const mid = analysis.meetingId.toString();
      if (!analysisMap[mid]) {
        analysisMap[mid] = analysis;
      }
    }

    const enrichedMeetings = meetings.map((m) => ({
      ...m,
      latestAnalysis: analysisMap[m._id.toString()] || null,
      actionItemCount: analysisMap[m._id.toString()]?.actionItems?.length || 0,
      pendingActions:
        analysisMap[m._id.toString()]?.actionItems?.filter((a) => a.status === 'Pending')
          .length || 0,
    }));

    return {
      meetings: enrichedMeetings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateMeeting(meetingId, userId, data) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw ApiError.notFound('Meeting not found');
    }

    const allowedUpdates = ['title', 'type', 'date', 'participants', 'tags'];
    for (const key of allowedUpdates) {
      if (data[key] !== undefined) {
        meeting[key] = data[key];
      }
    }

    await meeting.save();
    logger.info(`Meeting updated: ${meetingId}`);
    return meeting;
  }

  async deleteMeeting(meetingId, userId) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw ApiError.notFound('Meeting not found');
    }

    await Analysis.deleteMany({ meetingId });
    await Meeting.deleteOne({ _id: meetingId });

    logger.info(`Meeting deleted: ${meetingId}`);
  }

  async archiveMeeting(meetingId, userId) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw ApiError.notFound('Meeting not found');
    }

    meeting.isArchived = !meeting.isArchived;
    await meeting.save();
    return meeting;
  }

  async toggleShare(meetingId, userId) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw ApiError.notFound('Meeting not found');
    }

    if (meeting.isShared) {
      meeting.revokeShareToken();
    } else {
      meeting.generateShareToken();
    }

    await meeting.save();
    return meeting;
  }
}

module.exports = new MeetingService();
