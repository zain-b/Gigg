var usersModel = require('./users.model');
var debug = require('debug')('progressiveapp:server');

/**
 * users.controller.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * usersController.list()
     */
    list: function(req, res) {
        usersModel.find(function(err, users){
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
        usersModel.findOne({_id: id}, function(err, user){
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
     * usersController.create()
     */
    create: function(req, res) {
        debug(req.body.username);
        var user = new usersModel({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        });

        user.save(function(err, user){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving user',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: user._id
            });
        });
    },

    /**
     * usersController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        usersModel.findOne({_id: id}, function(err, user){
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
        usersModel.findByIdAndRemove(id, function(err, user){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
            return res.json(user);
        });
    }
};