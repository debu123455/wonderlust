const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewcontroler = require("../controler/review.js");

router.post("/", isLoggedIn, validateReview, wrapasync(reviewcontroler.createreview));


// Delete review route

router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapasync(reviewcontroler.deletereview))



module.exports = router;
