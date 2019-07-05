var express = require('express');
var router = express.Router();

var eventsRouter = require('./events/events.routes');
var storiesRouter = require('./stories/stories.routes');
var usersRouter = require('./users/users.routes');

router.use('/events', eventsRouter);
router.use('/stories', storiesRouter);
router.use('/users', usersRouter);

module.exports = router;