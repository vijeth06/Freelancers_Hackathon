const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

router.get(
  '/:shareToken',
  meetingController.getShared.bind(meetingController)
);

module.exports = router;
