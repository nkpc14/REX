import passport from 'passport'
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'
import {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} from '../config'
import User from '../../App/models/Users'
import jwt from 'jsonwebtoken'
import { generateJWT } from '../nervesAuth/auth'
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
},
async function (accessToken, refreshToken, profile, done) {
    const user = await User.findOne({googleId: profile.id});
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
            return done(null, users);
    } else {
        return done(null, user);
    }
}));
module.exports = passport;