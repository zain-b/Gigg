var PassportJWT = require('passport-jwt');
var JwtStrategy = PassportJWT.Strategy;
var ExtractJwt = PassportJWT.ExtractJwt;

/**
 * Load the user model and properties.
 */
var User = require('../api/users/users.model');
var properties = require('./properties');

/**
 * Setting up Passport to use JSON Web Tokens instead of sessions.
 * See: http://www.passportjs.org/packages/passport-jwt/
 * @param passport
 */

module.exports = {
    configure: function(passport) {
        var options = {};
        options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
        options.secretOrKey = properties.secret;

        passport.use(new JwtStrategy(options, function(jwt_payload, done) {
            User.findOne({id: jwt_payload.id}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }));
    }
};
