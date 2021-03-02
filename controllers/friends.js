const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

// Get friends page
module.exports.home = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  // Get list of friends and pending friend requests
  const user = await User.findById(id)
    .populate("friends", "firstName lastName fullName avatarUrl")
    .populate("friendRequests", "firstName lastName fullName avatarUrl")
    .populate("sentRequests", "firstName lastName fullName avatarUrl");
  // console.log("FRIENDS", user.friends);
  res.render("friends/home", {
    friends: user.friends,
    sentRequests: user.sentRequests,
    requests: user.friendRequests,
  });
});

// Get find friends page
module.exports.findFriends = catchAsync(async (req, res, next) => {
  // Find friends or requests of current user to exclude them from results
  const user = await User.findById(req.user._id);
  const exclusions = [req.user._id, ...user.friends, ...user.sentRequests];

  // Find people that are not friends or current user
  const people = await User.find({ _id: { $nin: exclusions } });
  res.render("friends/find", { people });
});

// Get single user page
module.exports.userPage = catchAsync(async (req, res, next) => {
  // Redirect to profile page if it is the current user
  if (req.params.id.toString() === req.user._id.toString()) {
    return res.redirect("/profile")
  }

  // Get information on user and the person which the page is about
  const personQuery = User.findById(req.params.id);
  const userQuery = User.findById(req.user._id);
  const [person, user] = await Promise.all([personQuery, userQuery]);

  // Check if person is a friend for displaying page
  const isFriend = user.friends.includes(person._id);

  // Check if they have a pending friend request
  const isPending = user.sentRequests.includes(person._id);

  res.render("friends/show", { person, isFriend, isPending });
});

// Submit friend request
module.exports.friendRequest = catchAsync(async (req, res, next) => {
  const { personId } = req.body;

  // Find user to submit friend request to and add current user to their array
  const personQuery = User.findByIdAndUpdate(personId, {
    $addToSet: { friendRequests: req.user._id },
  });

  // Save request to users sent requests
  const userQuery = User.findByIdAndUpdate(req.user._id, {
    $addToSet: { sentRequests: personId },
  });

  await Promise.all([personQuery, userQuery]);

  req.flash("success", "Request submitted");
  res.redirect("/friends");
});

// Accept friend request
module.exports.friendAccept = catchAsync(async (req, res, next) => {
  const { requesterId } = req.body;

  // Remove friend request from current user
  const requesterRemove = User.findByIdAndUpdate(req.user._id, {
    $pull: {
      friendRequests: requesterId,
    },
  });

  // Remove sent request from requesters array
  const userRemove = User.findByIdAndUpdate(requesterId, {
    $pull: {
      sentRequests: req.user._id,
    },
  });

  // Add to current users array of friends
  const requesterAdd = User.findByIdAndUpdate(req.user._id, {
    $addToSet: { friends: requesterId },
  });

  // Add to requesters array of friends
  const userAdd = User.findByIdAndUpdate(requesterId, {
    $addToSet: { friends: req.user._id },
  });

  // Perform all queries in parallel
  await Promise.all([requesterRemove, userRemove, requesterAdd, userAdd]);
  req.flash("success", "You are now friends");

  res.redirect("/friends");
});

// Cancel friend request
module.exports.cancelRequest = catchAsync(async (req, res, next) => {
  const { personId } = req.body;

  // Remove sent request from current user
  const userRemove = User.findByIdAndUpdate(req.user._id, {
    $pull: {
      sentRequests: personId,
    },
  });

  // Remove received request from receiver
  const receiverRemove = User.findByIdAndUpdate(personId, {
    $pull: {
      friendRequests: req.user._id,
    },
  });

  await Promise.all([userRemove, receiverRemove]);

  req.flash("success", "Canceled friend request");
  res.redirect("/friends");
});

// Unfriend a current friend of the user
module.exports.unfriend = catchAsync(async (req, res, next) => {
  const { personId } = req.body;
  console.log(req.body);

  // Remove friend from current user friends list
  const requesterRemove = User.findByIdAndUpdate(req.user._id, {
    $pull: {
      friends: personId,
    },
  });

  // Remove friend from other persons friends list
  const userRemove = User.findByIdAndUpdate(personId, {
    $pull: {
      friends: req.user._id,
    },
  });
  await Promise.all([requesterRemove, userRemove])
  req.flash("success", "You are no longer friends")
  res.redirect(`/friends/${personId}`)
});
