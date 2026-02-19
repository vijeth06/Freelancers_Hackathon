const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createMeetingSchema,
  updateMeetingSchema,
  listMeetingsSchema,
} = require('../validators/meetingValidator');

router.use(authenticate);

router.post(
  '/',
  validate(createMeetingSchema),
  meetingController.create.bind(meetingController)
);

router.get(
  '/search',
  meetingController.search.bind(meetingController)
);

router.get(
  '/',
  validate(listMeetingsSchema, 'query'),
  meetingController.list.bind(meetingController)
);

router.get(
  '/:id',
  meetingController.getById.bind(meetingController)
);

router.put(
  '/:id',
  validate(updateMeetingSchema),
  meetingController.update.bind(meetingController)
);

router.delete(
  '/:id',
  meetingController.delete.bind(meetingController)
);

router.patch(
  '/:id/archive',
  meetingController.archive.bind(meetingController)
);

router.patch(
  '/:id/share',
  meetingController.toggleShare.bind(meetingController)
);

module.exports = router;
