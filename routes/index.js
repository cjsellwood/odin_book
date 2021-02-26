const express = require("express");
const router = express.Router();
const index = require("../controllers/index")

// Home where posts by users friends are shown
router.get("/", index.home);

// Get login form
router.get("/login", index.loginForm);

// Login user
router.post("/login", index.loginUser)

// Get register user form
router.get('/register', index.registerForm);

// Register new user
router.post("/register", index.registerUser);

module.exports = router;