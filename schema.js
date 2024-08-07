const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required(),
});



module.exports.reviewSchema = Joi.object({
    comment: Joi.string().required(), // Ensuring Comment is a required string
    rating: Joi.number().min(1).max(5).required(), // Ensuring rating is between 1 and 5 and is required
    
});


