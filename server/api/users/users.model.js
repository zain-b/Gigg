var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
}, {timestamps: true});

module.exports = mongoose.model('User', User);