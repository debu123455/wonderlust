
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

 // Place this route BEFORE any "/:id" or "/:id/*" routes to avoid treating 'booked' as an id
router.get('/booked', isLoggedIn, wrapasync(async (req, res) => {
    await req.user.populate('bookings');
    res.render('listings/booked.ejs', { bookedListings: req.user.bookings });
}));

// Book a listing (add to user's bookings)
router.post('/:id/book', isLoggedIn, wrapasync(async (req, res) => {
    const listingId = req.params.id;
    const user = req.user;
    // Ensure both are strings for comparison
    if (!user.bookings.map(id => id.toString()).includes(listingId.toString())) {
        user.bookings.push(listingId);
        await user.save();
    }
    req.flash('success', 'Hotel booked and added to your bookings!');
    res.redirect('/listings/booked');
}));

// Unbook a listing (remove from user's bookings)

router.post('/:id/unbook', isLoggedIn, wrapasync(async (req, res) => {
    const listingId = req.params.id;
    const user = req.user;
    // Ensure both are strings for comparison
    user.bookings = user.bookings.filter(id => id.toString() !== listingId.toString());
    await user.save();
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ success: true });
    }
    req.flash('success', 'Hotel removed from your bookings!');
    res.redirect('/listings/booked');
}));

router.route('/:id')
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
