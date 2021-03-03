const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const {
  isLoggedIn,
  isPostAuthor,
  isCommentAuthor,
  validatePost,
  validateComment,
} = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 10 ** 6 },
  fileFilter: (req, file, cb) => {
    // Make sure uploaded file is an image
    const extension = file.mimetype.split("/")[1];
    const allowed = ["jpg", "jpeg", "png", "webp", "gif", "svg+xml", "avif"];
    if (allowed.includes(extension)) {
      return cb(null, true);
    } else {
      return cb(new ExpressError("File type not allowed", 400, "/new"));
    }
  },
});

// Redirect to home page
router.get("/", isLoggedIn, posts.home);

// Get new post form
router.get("/new", 
isLoggedIn, 
posts.newPostForm);

// Submit new post
router.post(
  "/new",
  isLoggedIn,
  upload.single("image"),
  validatePost,
  posts.newPost
);

// Submit new comment
router.post("/:id/comment", isLoggedIn, validateComment, posts.newComment);

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
