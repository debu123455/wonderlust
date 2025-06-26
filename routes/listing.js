const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingcontroler = require("../controler/listings.js");
const multer = require('multer');
const{storage} = require("../cloudCONFIG.js")
const upload = multer({ storage });

// Add search support to GET / route
router
.route("/")
     .get(wrapasync(listingcontroler.index))
     .post(isLoggedIn,
         upload.single('listing[image]'),
         validateListing,
         wrapasync(listingcontroler.createlisting));
      
 
 router.get("/new", isLoggedIn,
    listingcontroler.rendernewform );

 router.route("/:id")
 .get(wrapasync(listingcontroler.showListing))
 .put(
     isLoggedIn,
     isOwner,
     upload.single('listing[image]'),
     validateListing,
     
     wrapasync(listingcontroler.updateform,)

 )
 .delete(isLoggedIn,isOwner,wrapasync(listingcontroler.delete));
     
    




router.get("/:id/edit", isLoggedIn, isOwner,
     wrapasync(listingcontroler.edit));




module.exports = router;

