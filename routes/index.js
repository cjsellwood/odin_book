const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const passport = require("passport");
const {isLoggedIn} = require("../middleware")

// Home where posts by users friends are shown
router.get(
  "/",
  isLoggedIn,
  index.home
);

// Get login form
router.get("/login", index.loginForm);

// Login user
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: "Email or password incorrect" }),
  index.loginUser
);

// Get register user form
router.get("/register", index.registerForm);

// Register new user
router.post("/register", index.registerUser);

module.exports = router;
