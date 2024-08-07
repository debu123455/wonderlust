const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        const {name,email,password,confirmPassword} = req.body;
     const newUser = new user({email,username});
       const registerUser = await user.register(newUser ,password)
       req.flash("success" , "Welcome to wonderLust");
       res.redirect("/ listings");
    }
    
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/singup");
    }
}));

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login" , passport.authenticate(),async(req , res)=>{

} )
module.exports = router;

