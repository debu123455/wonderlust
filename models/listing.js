const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    image: {
        url:String,
        filename:String
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    location: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

}, { timestamps: true });


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;