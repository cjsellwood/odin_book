class ExpressError extends Error {
  constructor(message, statusCode, redirect) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.redirect = redirect;
  }
}

module.exports = ExpressError;
