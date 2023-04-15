var express = require('express');
var router = express.Router();
const Username=require("../helpers/error/UserError");
const{
  errorPrint,
  requestPrint,
  successPrint
}=require("../helpers/debug/debugprinters")
const db = require("../conf/database");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',(req,res, next)=> {
  let username = req.body.username;
  let email=req.body.email;
  let password = req.body.password;
  let confirmPassword=req.body.password;


 //////////////server side validation

  db.execute("SELECT * FROM users WHERE username=?", [username])
  .then(([result,fileds])=>{
    if(results && results.length == 0){
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
    }else{
      throw new UserError(
       "Registeration failed: Username already exists",
        "/registration",
        200
      );
    }
  })
  .then(([results, fields])=>{
    if(results && results.length == 0){
      let baseSQL="INSERT INTO users (username, email, password, createdAt) VALUSE(?,?,?,now());"
      return db.execute(baseSQL,[username,email,password])
    }else{
    throw new UserError(
     "Registeration failed: Email already exists",
      "/registration",
      200
    );
    }
  })
  .then(([resulys,fields])=>{
    if (results && results.affectedRows){
        successPrint("user.js --> user was created!!");
        res.redirect('/login');
    }else{
      throw new UserError(
        "Server Error, user could not be created",
        "/registration",
        500
      );
    }
  })
  .catch((err)=>{
    errorPrint("user could not made", err);
    if (err instanceof UserError){
      errorPrint(err.getMassage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }else{
      next(err);
    }
  });

});

module.exports = router;
