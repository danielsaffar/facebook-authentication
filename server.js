var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');

var app = express();

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');

});


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

passport.use(new FacebookStrategy({
    clientID: 1701592893502790,
    clientSecret: "28a12d2306059c2e661fc1bdde6f89ea",
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']

  },
  function(accessToken, refreshToken, profile, done) {
    console.log("accessToken:");
    console.log(accessToken);

    console.log("refreshToken:");
    console.log(refreshToken);

    console.log("profile:");
    console.log(profile);

    return done(null, profile);
  }
));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/facebookCanceled'
  }));

// in case of success
  app.get('/profile', function(req, res) {
  res.render('profile.ejs', {
  	user:req.user
  });
});
//in case of failure
app.get('/facebookCanceled', function(req, res) {
  res.send("fail!");
});


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(8000);