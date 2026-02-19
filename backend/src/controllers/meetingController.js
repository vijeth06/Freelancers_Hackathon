const meetingService = require('../services/meetingService');

class MeetingController {
  async create(req, res, next) {
    try {
      const meeting = await meetingService.createMeeting(req.userId, req.body);
      res.status(201).json({
        success: true,
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const meeting = await meetingService.getMeetingById(req.params.id, req.userId);
      res.json({
        success: true,
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async getShared(req, res, next) {
    try {
      const result = await meetingService.getMeetingByShareToken(req.params.shareToken);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await meetingService.listMeetings(req.userId, req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const meeting = await meetingService.updateMeeting(req.params.id, req.userId, req.body);
      res.json({
        success: true,
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await meetingService.deleteMeeting(req.params.id, req.userId);
      res.json({
        success: true,
        message: 'Meeting deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async archive(req, res, next) {
    try {
      const meeting = await meetingService.archiveMeeting(req.params.id, req.userId);
      res.json({
        success: true,
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleShare(req, res, next) {
    try {
      const meeting = await meetingService.toggleShare(req.params.id, req.userId);
      res.json({
        success: true,
        data: {
          isShared: meeting.isShared,
          shareToken: meeting.shareToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeetingController();
