const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');
const { updateAnalysisSchema } = require('../validators/analysisValidator');

router.use(authenticate);

router.post(
  '/meetings/:meetingId/generate',
  aiLimiter,
  analysisController.generate.bind(analysisController)
);

router.get(
  '/meetings/:meetingId/latest',
  analysisController.getLatest.bind(analysisController)
);

router.get(
  '/meetings/:meetingId/versions',
  analysisController.getVersions.bind(analysisController)
);

router.get(
  '/meetings/:meetingId/versions/:version',
  analysisController.getByVersion.bind(analysisController)
);

router.put(
  '/:analysisId',
  validate(updateAnalysisSchema),
  analysisController.update.bind(analysisController)
);

router.patch(
  '/:analysisId/confirm',
  analysisController.confirm.bind(analysisController)
);

router.get(
  '/:analysisId/history',
  analysisController.getEditHistory.bind(analysisController)
);

module.exports = router;
