const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const request = require("request");

// INDEX - show all campgrounds
router.get("/", async (req, res) => {
    try {
        const allCampgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds: allCampgrounds });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, async (req, res) => {
    const { name, image, description } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = { name, image, description, author };

    try {
        await Campground.create(newCampground);
        res.redirect("/campgrounds");
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", async (req, res) => {
    try {
        const foundCampground = await Campground.findById(req.params.id).populate("comments").exec();
        res.render("campgrounds/show", { campground: foundCampground });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// EDIT - show edit form for one campground
router.get("/:id/edit", middleware.checkUserCampground, async (req, res) => {
    try {
        const foundCampground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { campground: foundCampground });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// UPDATE - update a particular campground
router.put("/:id", middleware.checkUserCampground, async (req, res) => {
    const newData = { name: req.body.name, image: req.body.image, description: req.body.description };
    try {
        await Campground.findByIdAndUpdate(req.params.id, newData);
        req.flash("success", "Successfully Updated!");
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("back");
    }
});

// DELETE - remove a campground from the database
router.delete("/:id", middleware.checkUserCampground, async (req, res) => {
    try {
        await Campground.findByIdAndRemove(req.params.id);
        res.redirect("/campgrounds");
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

module.exports = router;