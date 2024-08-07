const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    console.log("hello");
    try{
        const {username,Email,password} = req.body;
        console.log(req.body);
     const newUser = new User({email:Email,username});
       const registerUser = await User.register(newUser ,password)
       req.flash("success","Welcome to wonderLust");
       res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate(),async(req , res)=>{

} )
module.exports = router;

