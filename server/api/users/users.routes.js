var express = require('express');
var router = express.Router();
var usersController = require('./users.controller');

/**
 * POST /register
 */
router.post('/register', usersController.register);

/**
 * POST /login
 */
router.post('/login', usersController.login);

/**
 * GET
 */
router.get('/', usersController.list);

/**
 * GET
 */
router.get('/:id', usersController.show);

/**
 * PUT
 */
router.put('/:id', usersController.update);

/**
 * DELETE
 */
router.delete('/:id', usersController.remove);

module.exports = router;