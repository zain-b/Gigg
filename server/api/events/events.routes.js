var express = require('express');
var router = express.Router();
var passport = require('passport');
var eventsController = require('./events.controller');
var upload = require('../../config/multer');

/**
 * GET
 */
router.get('/', eventsController.list);

/**
 * GET
 */
router.get('/:id', eventsController.show);

/**
 * POST
 */
router.post('/create',
    [passport.authenticate('jwt', { session: false}), upload.single('photo')],
    eventsController.create);

module.exports = router;