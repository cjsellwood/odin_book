const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

// Home where posts by users friends are shown
router.get("/", isLoggedIn, index.home);

// Get login form
router.get("/login", index.loginForm);

// Login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Email or password incorrect",
  }),
  index.loginUser
);

// Logout user
router.get("/logout", index.logoutUser);

// Get register user form
router.get("/register", index.registerForm);

// Register new user
router.post("/register", index.registerUser);

// Get profile page for user
router.get("/profile", isLoggedIn, index.getProfile);

// Get edit profile form
router.get("/profile/edit", isLoggedIn, index.editProfileForm)

// Submit edited user profile
router.patch("/profile/edit", isLoggedIn, index.updateProfile)

module.exports = router;
