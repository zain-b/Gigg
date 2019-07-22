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
        storiesModel.find()
            .populate('creator', '-password')
            .populate('event', '_id title')
            .sort('-createdAt')
            .exec(function(err, stories){
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
        storiesModel.findOne({_id: id}).populate('creator', '-password').exec(function(err, story){
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

        if (!req.body.title || !req.body.text || !req.body.event) {
            return res.status(400).json({
                success: false,
                message: 'Story title, text and event required.'
            });
        }

        let photos = [];

        if (req.files) {
            for (let photo of req.files) {
                photos.push(photo.filename);
            }
        }

        let story = new storiesModel({
            title: req.body.title,
            text: req.body.text,
            event: req.body.event,
            photos: photos,
            creator: req.user
        });

        story.save(function(err, story){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving story',
                    error: err
                });
            }

            storiesModel.findOne({_id: story._id})
                .populate('creator', '-password')
                .populate('event')
                .exec(function(err, story){
                if(err) {
                    return res.status(500).json({
                        message: 'An error occured when saving story.'
                    });
                }
                if(!story) {
                    return res.status(404).json({
                        message: 'Story does not exist after saving.'
                    });
                }

                res.io.emit('new-story', story);

                return res.json({
                    message: 'saved',
                    _id: story._id,
                    story: story
                });
            });

        });
    },
};