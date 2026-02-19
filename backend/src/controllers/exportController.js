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
}

module.exports = new ExportController();
