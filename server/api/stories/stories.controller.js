var storiesModel = require('./stories.model');

/**
 * stories.controller.js
 *
 * @description :: Server-side logic for managing stories.
 */
module.exports = {

    /**
     * storiesController.list()
     */
    list: function(req, res) {
        storiesModel.find(function(err, stories){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting stories.'
                });
            }
            return res.json(stories);
        });
    },

    /**
     * storiesController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        storiesModel.findOne({_id: id}, function(err, story){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting story.'
                });
            }
            if(!story) {
                return res.status(404).json({
                    message: 'No such story'
                });
            }
            return res.json(story);
        });
    },

    /**
     * storiesController.create()
     */
    create: function(req, res) {
        var story = new storiesModel({
            color : req.body.color,
            door : req.body.door
        });

        story.save(function(err, story){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving story',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: story._id
            });
        });
    },

    /**
     * storiesController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        storiesModel.findOne({_id: id}, function(err, story){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving story',
                    error: err
                });
            }
            if(!story) {
                return res.status(404).json({
                    message: 'No such story'
                });
            }

            story.text =  req.body.text ? req.body.text : story.text;
            story.photos =  req.body.photos ? req.body.photos : story.photos;

            story.save(function(err, story){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting story.'
                    });
                }
                if(!story) {
                    return res.status(404).json({
                        message: 'No such story'
                    });
                }
                return res.json(story);
            });
        });
    },

    /**
     * storiesController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        storiesModel.findByIdAndRemove(id, function(err, story){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting story.'
                });
            }
            return res.json(story);
        });
    }
};