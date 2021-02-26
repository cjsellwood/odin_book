// Show user friends posts
module.exports.home = async (req, res, next) => {
  res.render("index/home");
};

// Get login form
module.exports.loginForm = (req, res) => {
  res.render("index/loginForm");
};
