const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const { isLoggedIn, isPostAuthor, isCommentAuthor } = require("../middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Redirect to home page
router.get("/", isLoggedIn, posts.home);

// Get new post form
router.get("/new", isLoggedIn, posts.newPostForm);

// Submit new post
router.post("/new", isLoggedIn, upload.single("image"), posts.newPost);

// Submit new comment
router.post("/:id/comment", isLoggedIn, posts.newComment);

// Delete a comment
router.delete(
  "/:id/comment/:commentId",
  isLoggedIn,
  isCommentAuthor,
  posts.deleteComment
);

// Like a post
router.post("/:id/like", isLoggedIn, posts.likePost);

// Unlike a post
router.post("/:id/unlike", isLoggedIn, posts.unlikePost);

// Delete a post
router.delete("/:id", isLoggedIn, isPostAuthor, posts.deletePost);

module.exports = router;
