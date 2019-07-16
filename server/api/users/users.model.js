var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var properties = require('../../config/properties');
var jwt = require('jsonwebtoken');

var SALT_WORK_FACTOR = 10;

var User = new Schema({
    username: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
}, {timestamps: true});

/**
 * Mongoose middleware to automatically hash the password before it's
 * saved to the database.
 *
 * see: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
 */
User.pre('save', function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

// generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

User.methods.generateJSONWebToken = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + properties.loginExpiry);

    var tokenData = {
        _id: this._id,
        username: this.username,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    };

    // Encrypt user data with secret key
    return jwt.sign(tokenData, properties.secret);
};

module.exports = mongoose.model('User', User);