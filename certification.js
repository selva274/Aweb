const express=require('express');
const multer=require('multer');
const ejs=require('ejs');
const isLoggedIn=require('./isLoggedIn');
const certification=express();
const pool=require('./db');
const{name,image_src,id}=require("./app");

//router
const router=express.Router();
router.use(express.json());

router.use(express.json());
router.use(express.static("stylesheet"));
router.use(express.static(__dirname+'/'));



//multer
const filestorageengine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./datas/images/projects/certification')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
  });
  const upload=multer({
    storage:filestorageengine
  }); 
//http methods

let pro_path=[];

router.post("/",upload.array('images',100),(req,res)=>{
  console.log(req.files)
  for(let k of req.files){
    console.log(k.filename)
  }
  
  for(let k of req.files){
    pool.getConnection((err,connection)=>{
      if(err)throw err
    
      connection.query("INSERT INTO certification(img) VALUES (?)",[k.path],(err,row)=>{
          connection.release();
          if(!err){
                pro_path.push(k.path);
          }else{
              console.log(err)
          }
      });
  
  })

  }
  console.log(pro_path);
 
});

router.get('/',isLoggedIn,(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err)throw err
      
        connection.query("SELECT * from certification",(err,row)=>{
            connection.release();
            if(!err){
                // res.send(row)
                res.render('mycertification',{name:name,img_src:image_src,data:row}) 
            }else{
                console.log(err)
            }
        });
    
    })
  
   
})

// router.get('/projects', (req, res) => {
  
//   res.render('projects',{name:name,img_src:image_src});
// })


module.exports= router;