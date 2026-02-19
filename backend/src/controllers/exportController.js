const exportService = require('../services/exportService');
const ApiError = require('../utils/apiError');

class ExportController {
  async exportJSON(req, res, next) {
    try {
      const data = await exportService.exportJSON(req.params.meetingId, req.userId);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="meeting-${req.params.meetingId}.json"`
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async exportPDF(req, res, next) {
    try {
      const pdfBuffer = await exportService.exportPDF(req.params.meetingId, req.userId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="meeting-${req.params.meetingId}.pdf"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export action items to Trello board
   * Body: { boardId: string, listId?: string }
   */
  async exportToTrello(req, res, next) {
    try {
      const { boardId, listId } = req.body;
      
      if (!boardId) {
        throw ApiError.badRequest('Board ID is required');
      }

      const result = await exportService.exportToTrello(req.params.meetingId, req.userId, {
        boardId,
        listId,
      });

      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export action items to Notion database
   * Body: { databaseId: string }
   */
  async exportToNotion(req, res, next) {
    try {
      const { databaseId } = req.body;
      
      if (!databaseId) {
        throw ApiError.badRequest('Database ID is required');
      }

      const result = await exportService.exportToNotion(req.params.meetingId, req.userId, {
        databaseId,
      });

      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExportController();
