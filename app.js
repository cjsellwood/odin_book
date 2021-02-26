// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");

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

// App settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// For parsing form data
app.use(express.urlencoded({ extended: true }));

// Allows methods other than GET or POST
app.use(methodOverride("_method"));

// Sanitize user input before adding to mongodb
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Use imported routes
app.use("/", indexRouter);

// Listen on hosted port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Port " + port);
});
