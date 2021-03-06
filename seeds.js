const mongoose = require("mongoose");
const User = require("./models/user");
const faker = require("faker");
const Post = require("./models/post");
const Comment = require("./models/comment")
const bcrypt = require("bcrypt");

// Connect to database
const dbUrl = "mongodb://localhost/odin_book";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Generate random users
const seedUsers = async () => {
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await User.deleteMany({});
  const password = await bcrypt.hash("testuser", 12);
  const users = [];
  for (let i = 0; i < 48; i++) {
    const email = `test${i + 1}@test.com`;
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email,
      password,
      city: faker.address.city(),
      country: faker.address.country(),
      joinDate: faker.date.between(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
        new Date(Date.now())
      ),
      birthDate: faker.date.between(
        new Date(0),
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)
      ),
      avatarUrl: `/images/avatar-${(i % 16) + 1}.webp`,
    });
    // await user.save();
    users.push(user);
  }
  console.log(users);

  // Add friends to users
  for (let i = 0; i < users.length; i++) {
    const userId = users[i]._id;

    // Only do until minimum 12 friends
    while (users[i].friends.length < 12) {
      const friendIndex = Math.floor(Math.random() * 48);
      const friendId = users[friendIndex]._id;
      // If not already included in friends
      if (!users[i].friends.includes(friendId)) {
        users[i].friends.push(friendId);
        users[friendIndex].friends.push(userId);
      }
    }
  }

  // Add friend requests to users
  for (let i = 0; i < users.length; i++) {
    const userId = users[i]._id;

    // Only do until minimum 5 requests
    let iterations = 0;
    while (users[i].sentRequests.length < 5 && iterations < 1000) {
      const friendIndex = Math.floor(Math.random() * 48);
      const friendId = users[friendIndex]._id;

      // If already friends or sent or received request, restart loop
      if (
        users[i].friends.includes(friendId) ||
        users[i].sentRequests.includes(friendId) ||
        users[i].friendRequests.includes(friendId) ||
        users[friendIndex].friendRequests.includes(userId) ||
        users[friendIndex].sentRequests.includes(userId)
      ) {
        iterations++;
        continue;
      }

      users[i].sentRequests.push(friendId);
      users[friendIndex].friendRequests.push(userId);
    }
  }

  // Save users
  for (let user of users) {
    console.log(
      user.friends.length,
      user.sentRequests.length,
      user.friendRequests.length
    );
    await user.save();
  }


};

seedUsers().then(() => {
  mongoose.connection.close();
});
