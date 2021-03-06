const mongoose = require("mongoose");
const User = require("./models/user");
const faker = require("faker");
const Post = require("./models/post");
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
  await User.deleteMany({});
  const password = await bcrypt.hash("testuser", 12);
  const users = [];
  for (let i = 0; i < 48; i++) {
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: password,
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
      avatarUrl: `/images/avatar-${(1 + i) % 16}.webp`,
    });
    await user.save();
    users.push(user);
  }
  console.log(users)
};

seedUsers().then(() => {
  mongoose.connection.close();
});
