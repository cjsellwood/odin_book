const express = require("express");
const router = express.Router();
const friends = require("../controllers/friends");
const { isLoggedIn, setPreviousUrl } = require("../middleware");

// Get friends page
router.get("/", isLoggedIn, friends.home);

// Get find new friends page
router.get("/find", isLoggedIn, friends.findFriends);

// Submit a friend request to a user
router.post("/:id/request", isLoggedIn, friends.friendRequest);

// Accept a friend request from another user
router.post("/accept", isLoggedIn, friends.friendAccept);

// Cancel a friend request
router.post("/cancel", isLoggedIn, friends.cancelRequest);

// Get single page of a user
router.get("/:id", isLoggedIn, setPreviousUrl, friends.userPage);

// Unfriend a user
router.delete("/unfriend", isLoggedIn, friends.unfriend);

module.exports = router;
