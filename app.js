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
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/user");
const flash = require("connect-flash");
const session = require("express-session");

// Define imported routes
const indexRouter = require("./routes/index");

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

// Sessions configuration
const sessionSecret = process.env.SESSION_SECRET || "sessionsecret";
const sessionConfig = {
  secret: sessionSecret,
  name: "odin_book",
  resave: false,
  saveUninitialized: true,
  proxy: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
if (process.env.NODE_ENV === "production") {
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

// Flash messages to user
app.use(flash());

// Passport local strategy configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email });
      const isValid = await bcrypt.compare(password, user.password);
      if (!user || !isValid) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    }
  )
);

// Required passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Store user details
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get user details from database
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Save user and flashes to locals  for use in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // Save flash to locals
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Use imported routes
app.use("/", indexRouter);

// Listen on hosted port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Port " + port);
});
