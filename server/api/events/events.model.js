var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Event = new Schema({
    title: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
}, {timestamps: true});

module.exports = mongoose.model('Event', Event);