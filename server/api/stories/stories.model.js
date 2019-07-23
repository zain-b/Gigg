var mongoose = require('mongoose');
var User = require('../users/users.model');
var Event = require('../events/events.model');

var Schema = mongoose.Schema;

var Story = new Schema({
    tldr: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    photos: [{
        type: String
    }],
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'Event'}
}, {timestamps: true});

// Mongoose middleware to update the User object associated with this story.
Story.pre('save', function (next) {
    // Don't do anything unless this is a new Story being created
    if (!this.isNew) {
        return next();
    }

    User.updateOne({_id: this.creator}, {
        $push: {stories: this._id}
    }).then(function () {
        next();
    }).then(null, function (err) {
        next(err);
    });
});

// Mongoose middleware to update the Event object associated with this story.
Story.pre('save', function (next) {

    if (!this.isNew) {
        return next();
    }

    Event.updateOne({_id: this.event}, {
        $push: {stories: this._id}
    }).then(function () {
        next();
    }).then(null, function (err) {
        next(err);
    });
});

module.exports = mongoose.model('Story', Story);