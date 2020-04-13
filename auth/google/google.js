const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = require('../config');

const User = require('../../App/models/Users').default;

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback"
    },
    async function (accessToken, refreshToken, profile, done) {
        User.findOne({googleId: profile.id}).then(user => {
            if (!user) {
                const username = profile.emails[0].value.split('@')[0];
                const users = new User({
                    googleId: profile.id,
                    username: username,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    password: Math.random()
                });
                users.save();
                if (users)
                    return done(null, users);
            } else {
                return done(null, user);
            }
        }).catch(err => {
            return done(err)
        });
    }
));

module.exports = passport;
