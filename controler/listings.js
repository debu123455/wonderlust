
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.rendernewform =(req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createlisting =async (req, res, next) => {
      let url =req.file.path;
      let filename =req.path.filename;

    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};

    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.edit =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    res.render("../views/listings/edit.ejs", { listing });
}

module.exports.updateform =async (req, res) => {
    let { id } = req.params;
   let listing  = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    
   if( typeof req.file !=="undefined"){
   let url =req.file.path;
    let filename =req.path.filename;
    listing.image = {url,filename};
    await listing.save();
   }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
}
