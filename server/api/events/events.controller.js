var eventsModel = require('./events.model');

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
        eventsModel.find(function(err, events){
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
        eventsModel.findOne({_id: id}, function(err, event){
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
        var event = new eventsModel({
            title : req.body.title,
            location : req.body.location,
            date : req.body.date
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