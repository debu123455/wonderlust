const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const { q, sort } = req.query;
    let allListings;
    let matchStage = {};
    if (q) {
        const regex = new RegExp(q, 'i');
        matchStage = {
            $or: [
                { title: regex },
                { location: regex }
            ]
        };
    }
    if (sort === 'price_asc') {
        allListings = await Listing.find(matchStage).sort({ price: 1 });
    } else if (sort === 'price_desc') {
        allListings = await Listing.find(matchStage).sort({ price: -1 });
    } else {
        allListings = await Listing.find(matchStage);
    }
    res.render("listings/index.ejs", { allListings, query: { q, sort } });
}

module.exports.rendernewform = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createlisting = async (req, res, next) => {
    try {
        let url = req.file ? req.file.path : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
        let filename = req.file ? req.file.filename : 'default.jpg';

        const newListing = new Listing(req.body.listing);
        newListing.image = { url, filename };
        newListing.owner = req.user._id;

        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    res.render("../views/listings/edit.ejs", { listing });
}

module.exports.updateform = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.path.filename;
        listing.image = { url, filename };
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
