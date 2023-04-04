const express = require('express');
const session = require('express-session');
const passport = require('passport');
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');
const mysql=require('mysql');

const { urlencoded } = require('express');
require('./auth');
///main import section

const certification=require("./certification");
const isLoggedIn=require('./isLoggedIn');
const pool=require('./db');

const app = express();
//multer
const filestorageengine=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'./images')
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
});
const upload=multer({

  storage:filestorageengine
}); 


app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine','ejs');

app.use(express.static("stylesheet"));
app.use(express.static('images'));
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.render('signIn');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/getaccount',
    failureRedirect: '/auth/google/failure'
  })
);



let id;
let name;
let image_src;
let user;

app.get('/getaccount', isLoggedIn, (req, res) => {
  user=req.user;
  id=req.user.id;
  name=req.user.displayName;
  image_src=req.user.picture;
  pool.getConnection((err,connection)=>{
    if(err)throw err
  
    connection.query("INSERT INTO homedetails(id,Name,img) VALUES (?,?,?)",[req.user.id,req.user.displayName,req.user.picture],(err,row)=>{
        connection.release();
        if(!err){
                 res.render('getaccount',{id:req.user.id});
                 app.get(`/:${id}`,(req,res)=>{
                  pool.getConnection((err,connection)=>{
                    if(err)throw err
                  
                    connection.query("SELECT * FROM homedetails  where id=?",[id],(err,row)=>{
                        connection.release();
                        if(!err){                       
                          res.render('home',{id:id,name:name,img:image_src,data:row})
                          app.get(`/:${id}/myprojects`,isLoggedIn,(req,res)=>{
                            pool.getConnection((err,connection)=>{
                              if(err)throw err
                            
                              connection.query("SELECT * from project",(err,row)=>{
                                  connection.release();
                                  if(!err){
                                     
                                     res.render('myprojects',{id:id,name:name,img:image_src,data:row})
                                  }else{
                                      console.log(err)
                                  }
                              });
                          
                          })

                          })
                        
                          app.post(`/:${id}/myprojects`,upload.array('images',100),(req,res)=>{
                           
                            for(let k of req.files){
                              pool.getConnection((err,connection)=>{
                                if(err)throw err
                              
                                connection.query("INSERT INTO project(id,img) VALUES (?,?) ",[id,k.originalname],(err,row)=>{
                                    connection.release();
                                    if(!err){
                                         console.log("INSERTED IMG!");
                                    }else{
                                        console.log(err)
                                    }
                                });
                            
                            })
                          
                            }
                           
                          });
                          app.get(`/:${id}/mycertification`,isLoggedIn,(req,res)=>{
                            pool.getConnection((err,connection)=>{
                              if(err)throw err
                            
                              connection.query("SELECT * from project",(err,row)=>{
                                  connection.release();
                                  if(!err){
                                     
                                     res.render('mycertification',{id:id,name:name,img:image_src,data:row})
                                  }else{
                                      console.log(err)
                                  }
                              });
                          
                          })

                          })
                        
                          app.post(`/:${id}/mycertification`,upload.array('images',100),(req,res)=>{
                           
                            for(let k of req.files){
                              pool.getConnection((err,connection)=>{
                                if(err)throw err
                              
                                connection.query("INSERT INTO certification(id,img) VALUES (?,?) ",[id,k.originalname],(err,row)=>{
                                    connection.release();
                                    if(!err){
                                         console.log("INSERTED IMG!");
                                    }else{
                                        console.log(err)
                                    }
                                });
                            
                            })
                          
                            }
                           
                          });
                        }else{
                            console.log(err)
                        }
                    });
                
                })
                  
                })

        }else{
            console.log(err)
        }
    });
    
})
 

 
});
//retrieve from th  e database
app.get(`/projects`,isLoggedIn,(req,res)=>{
  pool.getConnection((err,connection)=>{
    if(err)throw err
  
    connection.query("SELECT img from project where id=?",[id],(err,row)=>{
        connection.release();
        if(!err){
       //  res.send(row)
           for(let s of row){
            console.log(s.img)
           }
          //  console.log(id);
             res.render('projects',{id:id,name:name,img:image_src,data:row})
        }else{
            console.log(err)
        }
    });

})

})
app.get(`/certification`,isLoggedIn,(req,res)=>{
  pool.getConnection((err,connection)=>{
    if(err)throw err
  
    connection.query("SELECT img from certification where id=?",[id],(err,row)=>{
        connection.release();
        if(!err){
       //  res.send(row)
          //  for(let s of row){
          //   console.log(s.img)
          //  }
          //  console.log(id);
             res.render('certification',{id:id,name:name,img:image_src,data:row})
        }else{
            console.log(err)
        }
    });

})

})

// app.use(`${id}/myprojects`,projects);
// router.use(`/:${id}/myprojects`,isLoggedIn,(req,res)=>{
  // pool.getConnection((err,connection)=>{
  //     if(err)throw err
    
  //     connection.query("SELECT * from project",(err,row)=>{
  //         connection.release();
  //         if(!err){
  //            // res.send(row)
  //            for(let s of row){
  //             console.log(s[0])
  //            }
  //            res.render('myprojects',{id:id,name:name,img:image_src,data:row})
  //         }else{
  //             console.log(err)
  //         }
  //     });
  
  // })

 
// })

app.use("/mycertification",certification);




app.get('/logout', (req, res) => {
    // req.logout();
     req.session.destroy();
     res.render('signIn');
     
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(5000, () => console.log('listening on port: 5000'));
