const User = require("../models/user");

// Get friends page
module.exports.home = async (req, res, next) => {
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
};

// Get find friends page
module.exports.findFriends = async (req, res, next) => {
  // Find friends or requests of current user to exclude them from results
  const user = await User.findById(req.user._id);
  const exclusions = [req.user._id, ...user.friends, ...user.sentRequests];

  // Find people that are not friends or current user
  const people = await User.find({ _id: { $nin: exclusions } });
  res.render("friends/find", { people });
};

// Get single user page
module.exports.userPage = async (req, res, next) => {
  const person = await User.findById(req.params.id);

  // Check if person is a friend for displaying page
  const user = await User.findById(req.user._id);
  const isFriend =
    user.friends.includes(person._id)
    
  const isPending = user.sentRequests.includes(person._id);

  res.render("friends/show", { person, isFriend, isPending });
};

// Submit friend request
module.exports.friendRequest = async (req, res, next) => {
  console.log(req.body);
  const { personId } = req.body;

  // Find user to submit friend request to and add current user to their array
  const person = await User.findByIdAndUpdate(personId, {
    $addToSet: { friendRequests: req.user._id },
  });

  // Save request to users sent requests
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { sentRequests: personId },
  });
   
  req.flash("success", "Request submitted")
  res.redirect("/friends");
};

// Accept friend request
module.exports.friendAccept = async (req, res, next) => {
  const { requesterId } = req.body;

  // Remove friend request from current user
  await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      friendRequests: requesterId,
    },
  });

  // Remove sent request from requesters array
  await User.findByIdAndUpdate(requesterId, {
    $pull: {
      sentRequests: req.user._id,
    },
  });

  // Add to current users array of friends
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { friends: requesterId },
  });

  // Add to requesters array of friends
  await User.findByIdAndUpdate(requesterId, {
    $addToSet: { friends: req.user._id },
  });

  req.flash("success", "You are now friends")

  res.redirect("/friends");
};

// Cancel friend request
module.exports.cancelRequest = async (req, res, next) => {
  const { personId } = req.body;

  // Remove sent request from current user
  await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      sentRequests: personId,
    },
  });

  // Remove received request from other user
  await User.findByIdAndUpdate(personId, {
    $pull: {
      friendRequests: req.user._id,
    },
  });

  req.flash("success", "Canceled friend request")
  res.redirect("/friends");
};
