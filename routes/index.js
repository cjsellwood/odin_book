const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const passport = require("passport");
const {
  isLoggedIn,
  validateRegister,
  validateEditProfile,
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
    console.log(file);
    const allowed = ["jpg", "jpeg", "png", "webp", "gif", "svg+xml", "avif"];
    if (allowed.includes(extension)) {
      return cb(null, true);
    } else {
      return cb(new ExpressError("File type not allowed", 400, "/profile/edit"));
    }
  },
});

// Home where posts by users friends are shown
router.get("/", isLoggedIn, index.home);

// Get login form
router.get("/login", index.loginForm);

// Login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Email or password incorrect",
  }),
  index.loginUser
);

// Logout user
router.get("/logout", index.logoutUser);

// Get register user form
router.get("/register", index.registerForm);

// Register new user
router.post("/register", validateRegister, index.registerUser);

// Get profile page for user
router.get("/profile", isLoggedIn, index.getProfile);

// Get edit profile form
router.get("/profile/edit", isLoggedIn, index.editProfileForm);

// Submit edited user profile
router.patch(
  "/profile/edit",
  isLoggedIn,
  upload.single("avatar"),
  validateEditProfile,
  index.updateProfile
);

module.exports = router;
