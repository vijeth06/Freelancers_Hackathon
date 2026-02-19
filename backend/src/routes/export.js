const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get(
  '/meetings/:meetingId/json',
  exportController.exportJSON.bind(exportController)
);

router.get(
  '/meetings/:meetingId/pdf',
  exportController.exportPDF.bind(exportController)
);

module.exports = router;
