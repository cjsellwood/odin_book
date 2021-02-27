const User = require("../models/user");

// Get friends page
module.exports.home = async (req, res, next) => {
  const { id } = req.user;
  // Get list of friends and pending friend requests
  const user = await User.findById(id)
    .populate("friends", "firstName lastName fullName avatarUrl")
    .populate("friendRequests");
  // console.log("FRIENDS", user.friends);
  res.render("friends/home", {
    friends: user.friends,
    requests: user.friendRequests,
  });
};

// Get find friends page
module.exports.findFriends = async (req, res, next) => {
  const people = await User.find({});
  res.render("friends/find", { people });
};

// Get single user page
module.exports.userPage = async (req, res, next) => {
  const person = await User.findById(req.params.id);
  res.render("friends/show", { person });
};

// Submit friend request
module.exports.friendRequest = async (req, res, next) => {
  console.log(req.body);
  const { personId } = req.body;

  // Find user to submit friend request to and add current user to their array
  const person = await User.findByIdAndUpdate(personId, {
    $push: { friendRequests: req.user._id },
  });
  console.log(person);
  res.redirect("/friends");
};

// Accept friend request
module.exports.friendAccept = async (req, res, next) => {
  console.log(req.body);

  const { requesterId } = req.body;

  // Remove friend request from current user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        friendRequests: requesterId,
      },
    },
  );

  // Add to current users array of friends
  await User.findByIdAndUpdate(req.user._id, {
    $push: { friends: requesterId },
  });

  // Add to requesters array of friends
  await User.findByIdAndUpdate(requesterId, {
    $push: { friends: req.user._id },
  });

  res.redirect("/friends");
};
