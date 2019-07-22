var express = require('express');
var router = express.Router();
var passport = require('passport');
var storiesController = require('./stories.controller');

var upload = require('../../config/multer');

/**
 * GET
 */
router.get('/', storiesController.list);

/**
 * GET
 */
router.get('/:id', storiesController.show);

/**
 * POST
 */
router.post('/create',
    [passport.authenticate('jwt', { session: false}), upload.array('photos', 12)],
    storiesController.create);

module.exports = router;