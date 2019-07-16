var mongoose = require('mongoose');
var User = require('../users/users.model');

var Schema = mongoose.Schema;

var Event = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    location: {
        address: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        city: {
            type: String
        },
        country: {
            type: String
        }
    },
    date: {
        type: Date,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    stories: [{type: Schema.Types.ObjectId, ref: 'Story'}]
}, {timestamps: true});

mongoose.set('debug', true);

Event.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});

// Index the title, description and address into one index for quick searching.
Event.index({
    title: 'text',
    description: 'text',
    'location.address': 'text'
}, {
    weights: {
        title: 3,
        description: 1,
        'location.address': 5
    },
});

// Mongoose middleware to update the User object associated with this Event.
Event.pre('save', function (next) {
    // Don't do anything unless this is a new Story being created
    if (!this.isNew) {
        return next();
    }

    // Find the user that created the event and update their events array
    User.updateOne({_id: this.creator}, {
        $push: {events: this._id}
    }).then(function () {
        next();
    }).then(null, function (err) {
        next(err);
    });
});

module.exports = mongoose.model('Event', Event);