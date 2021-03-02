const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
  confirmPassword: Joi.ref("password"),
}).required();

module.exports.editProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  city: Joi.string(),
  country: Joi.string(),
  birthDate: Joi.string(),
}).required();

module.exports.postSchema = Joi.object({
  content: Joi.string().required(),
}).required();

module.exports.commentSchema = Joi.object({
  content: Joi.string().required(),
}).required();
