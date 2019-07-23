var debug = require('debug')('gigg-server:server');
var User = require('./users.model');

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
        if (!req.body.username || !req.body.password || !req.body.email || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, password and profile picture required.'
            });
        }

        var user = new User({
            username: req.body.username,
            email:    req.body.email,
            password: req.body.password,
            photo: req.file.filename
        });

        // save the user
        user.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: 'Unable to save user' + err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Successful created new user.'
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
                    message: 'Authentication failed. User not found.'
                });
            }
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = user.generateJSONWebToken();

                    // return the information including token as JSON
                    return res.status(200).json({
                        success: true,
                        user: {
                            username: user.username,
                            email   : user.email,
                            photo   : user.photo,
                            token: 'JWT ' + token
                        }
                    });
                }

                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            });

        });
    },
};