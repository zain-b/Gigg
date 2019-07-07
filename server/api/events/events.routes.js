var express = require('express');
var router = express.Router();
var passport = require('passport');
var eventsController = require('./events.controller');

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
router.post('/', passport.authenticate('jwt', { session: false}), eventsController.create);

/**
 * PUT
 */
router.put('/:id', passport.authenticate('jwt', { session: false}), eventsController.update);

/**
 * DELETE
 */
router.delete('/:id', passport.authenticate('jwt', { session: false}), eventsController.remove);

module.exports = router;