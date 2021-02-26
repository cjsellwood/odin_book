// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Define imported routes
const indexRouter = require("./routes/index");

// Connect to database
const dbUrl = "mongodb://localhost/odin_book";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Use imported routes
app.use("/", indexRouter);

// Listen on hosted port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Port " + port);
});
