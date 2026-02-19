const express = require('express');
const router = express.Router();
const actionItemController = require('../controllers/actionItemController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  updateActionItemSchema,
  actionItemFilterSchema,
} = require('../validators/analysisValidator');

router.use(authenticate);

router.get(
  '/',
  validate(actionItemFilterSchema, 'query'),
  actionItemController.listAll.bind(actionItemController)
);

router.get(
  '/stats',
  actionItemController.getDashboardStats.bind(actionItemController)
);

router.patch(
  '/:analysisId/:actionItemId',
  validate(updateActionItemSchema),
  actionItemController.updateActionItem.bind(actionItemController)
);

module.exports = router;
