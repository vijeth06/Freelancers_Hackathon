const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Basic exports
router.get(
  '/meetings/:meetingId/json',
  exportController.exportJSON.bind(exportController)
);

router.get(
  '/meetings/:meetingId/pdf',
  exportController.exportPDF.bind(exportController)
);

// Third-party integrations
router.post(
  '/meetings/:meetingId/trello',
  exportController.exportToTrello.bind(exportController)
);

router.post(
  '/meetings/:meetingId/notion',
  exportController.exportToNotion.bind(exportController)
);

module.exports = router;
