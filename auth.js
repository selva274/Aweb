const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "516180371370-7ia2tppunnolnd137ra5afktmq3s9951.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://good-ruby-lemming-slip.cyclic.app/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    
  done(null, user);
});
