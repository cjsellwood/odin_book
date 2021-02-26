const express = require("express");
const router = express.Router();
const index = require("../controllers/index")

// Home where posts by users friends are shown
router.get("/", index.home);

// Get login form
router.get("/login", index.loginForm);

module.exports = router;