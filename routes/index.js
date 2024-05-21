const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register", { page: 'register' });
});

// handle sign up logic
router.post("/register", async (req, res) => {
    const newUser = new User({ username: req.body.username });
    try {
        const user = await User.register(newUser, req.body.password);
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/register");
    }
});

// show login form
router.get("/login", (req, res) => {
    res.render("login", { page: 'login' });
});

// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to YelpCamp!"
}), (req, res) => { });

// logout route
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash("success", "Logged you out!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;