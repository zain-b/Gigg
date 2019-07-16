var eventsModel = require('./events.model');
var usersModel = require('../users/users.model');

/**
 * events.controller.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {

    /**
     * eventsController.list()
     */
    list: function(req, res) {
        eventsModel.find()
            .populate('creator', '-password')
            .sort('-createdAt')
            .exec(function(err, events){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting events.'
                });
            }
            return res.json(events);
        });
    },

    /**
     * eventsController.show()
     */
    show: function(req, res) {
        var id = req.params.id;

        /**
         * The event model will return 'creator' as the ID of the user as JSON in the response. However,
         * We want it to return the user as an object so we can access username etc. The 'populate'
         * function will resolve the user based on the creator id and add it to the JSON response.
         *
         * Don't send back password!
         */
        eventsModel.findOne({_id: id})
            .populate('creator', '-password')
            .populate({path: 'stories', populate: {path: 'creator', select: '_id username photo'}})
            .exec(function(err, event) {
            if(err) {
                return res.status(500).json({
                    message: 'Error getting event.'
                });
            }
            if(!event) {
                return res.status(404).json({
                    message: 'No such event'
                });
            }
            return res.json(event);
        });
    },

    /**
     * eventsController.create()
     */
    create: function(req, res) {

        if (!req.body.title || !req.body.location || !req.body.date || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Event title, location, date and image required.'
            });
        }

        var event = new eventsModel({
            title : req.body.title,
            date : req.body.date,
            photo : req.file.filename,
            location : {
                address: req.body.location.address,
                x: req.body.location.x,
                y: req.body.location.y,
                city: req.body.location.city,
                country: req.body.location.country
            },
            creator: req.user
        });

        event.save(function(err, event){
            if(err) {
                return res.status(500).json({
                    user: req.user,
                    message: 'Error saving event',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: event._id
            });
        });
    },

    /**
     * eventsController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        eventsModel.findOne({_id: id}, function(err, event){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving event',
                    error: err
                });
            }
            if(!event) {
                return res.status(404).json({
                    message: 'No such event'
                });
            }

            event.title =  req.body.title ? req.body.title : event.title;
            event.location =  req.body.location ? req.body.location : event.location;
            event.date =  req.body.date ? req.body.date : event.date;

            event.save(function(err, event){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting event.'
                    });
                }
                if(!event) {
                    return res.status(404).json({
                        message: 'No such event'
                    });
                }
                return res.json(event);
            });
        });
    },

    /**
     * eventsController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        eventsModel.findByIdAndRemove(id, function(err, event){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting event.'
                });
            }
            return res.json(event);
        });
    }
};