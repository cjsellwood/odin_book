const bcrypt = require("bcrypt");
const Post = require("../models/post");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

// Show user friends posts
module.exports.home = catchAsync(async (req, res, next) => {
  // Get current users friends list
  const user = await User.findById(req.user._id);
  const friends = [req.user._id, ...user.friends];

  // Get posts from the current user and their friends
  const posts = await Post.find({ author: { $in: friends } })
    .populate("author", "firstName lastName fullName")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "firstName lastName fullName",
        model: "User",
      },
    });

  // Sort by most recent
  posts.sort((a, b) => b.date - a.date);
  res.render("index/home", { posts });
});

// Get login form
module.exports.loginForm = (req, res) => {
  res.render("index/loginForm");
};

// Login user
module.exports.loginUser = (req, res) => {
  const url = req.session.returnTo || "/";

  // Reset return to
  delete req.session.returnTo;
  req.flash("success", "Logged In");
  res.redirect(url);
};

// Logout user
module.exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect("/login");
};

// Get register new user form
module.exports.registerForm = (req, res) => {
  res.render("index/registerForm");
};

// Register new user
module.exports.registerUser = catchAsync(async (req, res, next) => {
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
      req.flash("error", "Something went wrong " + err.message);
    }
    return res.redirect("/register");
  }

  // Login user
  req.login(user, (err) => {
    if (err) return next(err);
  });

  req.flash("success", "Registered and logged in");

  res.redirect("/");
});

// Get profile page of user
module.exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.render("index/profile", { user });
});

// Get profile edit form
module.exports.editProfileForm = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.render("index/editProfileForm", { user });
});

// Update user profile from edit form submission
module.exports.updateProfile = catchAsync(async (req, res, next) => {
  const { edit } = req.body;

  // Update values
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...edit,
      birthDate: new Date(edit.birthDate),
    },
    { new: true }
  );
  res.redirect("/profile");
});
