const express = require('express');
const session = require('express-session');
const passport = require('passport');
const ejs=require('ejs');
const mysql=require('mysql');
const { urlencoded } = require('express');
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
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
//Database
// const pool=mysql.createPool({
//   connectionLimit:10,
//   host:'localhost',
//   user:"root",
//   password:"",
//   database:"cv"
// });



let name;
let image_src;
let id
app.get('/home', isLoggedIn, (req, res) => {
  name=req.user.displayName;
  image_src=req.user.picture;
  id:req.user.id;
  console.log(name);
//   pool.getConnection((err,connection)=>{
//     if(err)throw err
  
//     connection.query("UPDATE homedetails set Name=? ,img=? where=?",[name,image_src,id],(err,row)=>{
//         connection.release();
//         if(!err){
//                     console.log("update successfully!")
//         }else{
//             console.log(err)
//         }
//     });

// })
  res.render('home',{name:name,img_src:image_src});
});



app.get('/projects', isLoggedIn, (req, res) => {
  
  res.render('projects',{name:name,img_src:image_src});
});
app.get('/certification', isLoggedIn, (req, res) => {
  res.render('certification',{name:name,img_src:image_src});
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
