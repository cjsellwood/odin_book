const Post = require("../models/post");
const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");

// Redirect to homepage
module.exports.home = (req, res) => {
  res.redirect("/");
};

// Get new post form
module.exports.newPostForm = (req, res) => {
  res.render("posts/newPostForm");
};

// Submit new post data
module.exports.newPost = catchAsync(async (req, res, next) => {
  // Get post data from form and user info
  const { content } = req.body;
  const { id } = req.user;

  // Create new post
  const post = new Post({
    content,
    author: id,
    date: Date.now(),
  });

  // Save new posts and redirect home
  await post.save();
  req.flash("success", "Post added");
  res.redirect("/");
});

// Submit new comment
module.exports.newComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  // Create and save new comment
  const comment = new Comment({
    content,
    author: req.user._id,
    date: Date.now(),
  });
  await comment.save();

  // Add to posts comments
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: comment._id },
  });

  res.redirect("/");
});

// Like a post
module.exports.likePost = catchAsync(async (req, res, next) => {
  const { postId } = req.body;
  const post = await Post.findByIdAndUpdate(postId, {
    $addToSet: { likes: req.user._id },
  });
  res.redirect("/");
});

// Unlike a post
module.exports.unlikePost = catchAsync(async (req, res, next) => {
  const { postId } = req.body;
  const post = await Post.findByIdAndUpdate(postId, {
    $pull: { likes: req.user._id },
  });
  res.redirect("/");
});
