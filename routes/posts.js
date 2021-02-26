const express = require("express")
const router = express.Router();
const posts = require("../controllers/posts")
const {isLoggedIn} = require("../middleware")

// Redirect to home page
router.get("/", isLoggedIn, posts.home)

// Get new post form
router.get("/new", isLoggedIn, posts.newPostForm)

// Submit new post
router.post("/new", isLoggedIn, posts.newPost)

module.exports = router;