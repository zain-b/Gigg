var debug = require('debug')('progressiveapp:server');
var User = require('./users.model');
var properties = require('../../config/properties');
var jwt = require('jsonwebtoken');

/**
 * users.controller.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * usersController.register()
     */
    register: function(req, res) {
        if (!req.body.username || !req.body.password || !req.body.email) {
            return res.status(400).json({
                success: false,
                msg: 'Username, email and password required.'
            });
        }

        var user = new User({
            username: req.body.username,
            email:    req.body.email,
            password: req.body.password
        });

        // save the user
        user.save(function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Username or email already exists.'
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Successful created new user.'
            });
        });
    },

    /**
     * usersController.login()
     */
    login: function(req, res) {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    msg: 'Authentication failed. User not found.'
                });
            }
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), properties.secret);
                    // return the information including token as JSON
                    return res.status(200).json({
                        success: true,
                        token: 'JWT ' + token
                    });
                }

                return res.status(401).json({
                    success: false,
                    msg: 'Authentication failed. Wrong password.'
                });
            });

        });
    },

    /**
     * usersController.list()
     */
    list: function(req, res) {
        User.find(function(err, users){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting users.'
                });
            }
            return res.json(users);
        });
    },

    /**
     * usersController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        User.findOne({_id: id}, function(err, user){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
            if(!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

    /**
     * usersController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        User.findOne({_id: id}, function(err, user){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving user',
                    error: err
                });
            }
            if(!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username =  req.body.color ? req.body.color : user.username;
            user.email =  req.body.door ? req.body.door : user.email;
            user.password =  req.body.door ? req.body.door : user.password;

            user.save(function(err, user){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting user.'
                    });
                }
                if(!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }
                return res.json(user);
            });
        });
    },

    /**
     * usersController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        User.findByIdAndRemove(id, function(err, user){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
            return res.json(user);
        });
    }
};