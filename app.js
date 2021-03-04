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
const compression = require("compression");
const helmet = require("helmet");
const ExpressError = require("./utils/ExpressError");

// Define imported routes
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const friendsRouter = require("./routes/friends");

// Connect to database
const dbUrl = "mongodb://localhost/odin_book";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
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

// Minimize size of app
app.use(compression());

// Secure app
app.use(helmet());

// Helmet configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", "ws://10.0.0.6:35729"],
      scriptSrc: ["'unsafe-inline'", "'self'", "http://10.0.0.6:35729"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "res.cloudinary.com/due9a2put/"],
      fontSrc: ["'self'"],
    },
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

// Live reload browser for dev
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.watch(path.join(__dirname, "views"))

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Use imported routes
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/friends", friendsRouter);

// Handle not found error
app.use("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404, false));
});

// Handle errors
app.use((err, req, res, next) => {
  console.log("ERROR MESSAGE", err.message);
  if (err.redirect) {
    req.flash("error", err.message);
    res.status(err.statusCode).redirect(err.redirect);
  } else {
    res.status(err.statusCode).render("error", { err });
  }
});

// Listen on hosted port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Port " + port);
});

// client validation
// styles {
// /
// possibly file chooser
// }
