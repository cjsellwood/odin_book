const Post = require("../models/post")

// Redirect to homepage
module.exports.home = (req, res) => {
  res.redirect("/")
}

// Get new post form
module.exports.newPostForm = (req, res) => {
  res.render("posts/newPostForm")
}

// Submit new post data
module.exports.newPost = async(req, res, next) => {
  // Get post data from form and user info
  const {content} = req.body;
  const {id} = req.user;

  // Create new post
  const post = new Post({
    content,
    author: id,
    date: Date.now(),
  })

  // Save new posts and redirect home
  await post.save();
  req.flash("success", "Post added")
  res.redirect("/")
  console.log(post);
}