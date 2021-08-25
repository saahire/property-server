const express = require('express');
const { body } = require('express-validator');
const settingController = require('../controller/setting');

const router = express.Router();

router.get('/:hostelId', settingController.getSetting);

router.patch('/:hostelId', settingController.patchSetting);

module.exports = router;