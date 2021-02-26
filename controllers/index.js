const bcrypt = require("bcrypt");
const Post = require("../models/post");
const user = require("../models/user");
const User = require("../models/user");

// Show user friends posts
module.exports.home = async (req, res, next) => {
  // Get posts from the current user
  const posts = await Post.find({ author: req.user._id }).populate(
    "author",
    "firstName lastName fullName"
  );
  console.log(posts);
  res.render("index/home", { posts });
};

// Get login form
module.exports.loginForm = (req, res) => {
  res.render("index/loginForm");
};

// Login user
module.exports.loginUser = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const url = req.session.returnTo || "/";
  // Reset return to
  delete req.session.returnTo;
  req.flash("success", "Logged In");
  res.redirect(url);
};

// Get register new user form
module.exports.registerForm = (req, res) => {
  res.render("index/registerForm");
};

// Register new user
module.exports.registerUser = async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    joinDate: Date.now(),
  });

  // If mongoose error flash error and show register form again
  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      req.flash("error", "User already exists");
    } else {
      req.flash("error", "Something went wrong");
    }
    return res.redirect("/register");
  }

  // Login user
  req.login(user, (err) => {
    if (err) return next(err);
  });

  req.flash("success", "Registered and logged in");

  res.redirect("/");
};
