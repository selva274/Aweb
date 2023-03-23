const express = require('express');
const session = require('express-session');
const passport = require('passport');
const ejs=require('ejs');
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','ejs');
app.use(express.static("stylesheet"))
app.get('/', (req, res) => {
  res.render('signIn');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/home',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/home', isLoggedIn, (req, res) => {
  res.render('home',{name:req.user.displayName,img_src:req.user.picture});
});
app.get('/projects', isLoggedIn, (req, res) => {
  res.render('projects',{name:req.user.displayName,img_src:req.user.picture});
});
app.get('/certification', isLoggedIn, (req, res) => {
  res.render('certification',{name:req.user.displayName,img_src:req.user.picture});
});

app.get('/logout', (req, res) => {
    // req.logout();
     req.session.destroy();
     res.render('signIn');
     
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(5000, () => console.log('listening on port: 5000'));
