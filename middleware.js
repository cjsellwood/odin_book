const Post = require("./models/post");
const Comment = require("./models/comment")

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

// Check if user is author of post before allowing modification
module.exports.isPostAuthor = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You are not authorized to do that");
    return res.redirect("/");
  }
  next();
};

// Check if user is author of comment before allowing modification
module.exports.isCommentAuthor = async (req, res, next) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (comment.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You are not authorized to do that");
    return res.redirect("/");
  }
  next();
};
