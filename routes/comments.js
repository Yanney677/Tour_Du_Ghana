const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render("comments/new", { campground });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// Comments Create
router.post("/", middleware.isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        const comment = await Comment.create(req.body.comment);
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        req.flash("success", "Successfully added comment!");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("back");
    }
});

// COMMENT EDIT ROUTE
router.get("/:commentId/edit", middleware.checkUserComment, async (req, res) => {
    try {
        const foundComment = await Comment.findById(req.params.commentId);
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

// COMMENT UPDATE
router.put("/:commentId", middleware.checkUserComment, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.commentId, req.body.comment);
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        res.redirect("back");
    }
});

// COMMENT DESTROY ROUTE
router.delete("/:commentId", middleware.checkUserComment, async (req, res) => {
    try {
        await Comment.findByIdAndRemove(req.params.commentId);
        req.flash("success", "Comment deleted!");
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        res.redirect("back");
    }
});

module.exports = router;