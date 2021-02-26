// Show user friends posts
module.exports.home = async (req, res, next) => {
  res.render("index/home");
};

// Get login form
module.exports.loginForm = (req, res) => {
  res.render("index/loginForm");
};

// Login user
module.exports.loginUser = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  res.redirect("/");
};

// Get register new user form
module.exports.registerForm = (req, res) => {
  res.render("index/registerForm");
};

// Register new user
module.exports.registerUser = async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  res.redirect("/");
};
