const mongoose = require("mongoose");
const User = require("./models/user");
const faker = require("faker");
const Post = require('./models/post')

// Connect to database
const dbUrl = "mongodb://localhost/odin_book";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true,   useCreateIndex: true, });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Generate random users
const seedUsers = async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatarUrl: "https://placeimg.com/200/200/people",
      city: faker.address.city(),
      country: faker.address.country(),
      joinDate: faker.date.recent(),
      birthDate: faker.date.past(),
    });
    await user.save();
  }
};

seedUsers().then(() => {
  mongoose.connection.close();
});
