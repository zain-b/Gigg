var express = require('express');
var router = express.Router();

var eventsRouter = require('./events/events.routes');
var storiesRouter = require('./stories/stories.routes');
var usersRouter = require('./users/users.routes');
var searchRouter = require('./search/search.routes');

router.use('/events', eventsRouter);
router.use('/stories', storiesRouter);
router.use('/users', usersRouter);
router.use('/search', searchRouter);

module.exports = router;