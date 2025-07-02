if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Use only environment variable for dburl, fallback to localhost if not set
const dburl = process.env.ATLASDB_URL ||
 "mongodb+srv://<devsharma45637>:<K3NUmiKMFLWIi3Ue>@cluster0.erbfn.mongodb.net/devsharma45637?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dburl)
    .then(() => {
        console.log("Connected to MongoDB database");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    });

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET || 'defaultsecret',
    },
    
    touchAfter: 24 * 3600, 
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

// Route Handlers
app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.get('/add-demo-listing', async (req, res) => {
    const Listing = require('./models/listing');
    const User = require('./models/user');
    let owner = await User.findOne();
    if (!owner) {
        return res.send('No user found. Please register a user first.');
    }
    const demoListing = new Listing({
        title: 'Villa in Bandra',
        description: 'Urban luxury retreat in the heart of Mumbai’s Bandra. Spacious, sunlit rooms, private garden, elegant interiors, and steps from cafes, boutiques, and the sea.',
        image: {
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            filename: 'demo-villa-bandra.jpg'
        },
        price: 12000,
        location: 'Bandra, Mumbai',
        country: 'India',
        owner: owner._id
    });
    await demoListing.save();
    res.send('Demo listing added! Go to /listings to see it.');
});


app.use((err, req, res, next) => {
    console.error('Error details:', err); 
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message: err.message || message });
});

const PORT = process.env.PORT || 4000; 
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port or stop the other process.`);
        process.exit(1);
    } else {
        throw err;
    }
});