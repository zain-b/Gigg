var express = require('express');
var router = express.Router();
var searchController = require('./search.controller');

/**
 * GET search events
 */
router.get('/events', searchController.searchEvents);

/**
 * GET search stories
 */
//router.get('/stories', searchController.searchStories);

module.exports = router;