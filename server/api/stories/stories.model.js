var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema({
    text: {
        type: String,
        required: true,
    },
    photos: {
        type: String,
        required: true
    },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' }
}, {timestamps: true});

module.exports = mongoose.model('Story', Story);