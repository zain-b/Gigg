var express = require('express');
var router = express.Router();
var storiesController = require('./stories.controller');

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
router.post('/', storiesController.create);

/**
 * PUT
 */
router.put('/:id', storiesController.update);

/**
 * DELETE
 */
router.delete('/:id', storiesController.remove);

module.exports = router;