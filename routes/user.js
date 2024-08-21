const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");
const usercontroler = require("../controler/user.js");




router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(usercontroler.singup));



router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post("/login", passport.authenticate("local",
     { failureRedirect: '/login',
         failureFlash: true }), usercontroler.login);


router.get("/logout", usercontroler.logout);

module.exports = router;