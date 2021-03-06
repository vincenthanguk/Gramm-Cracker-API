const express = require('express');
const studysessionController = require('../controllers/studysessionController');

const router = express.Router();
const { verifyUser } = require('../authenticate');

router.route('/').post(verifyUser, studysessionController.createStudysession);

module.exports = router;
