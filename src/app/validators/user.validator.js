const Joi = require("joi");
const { Roles } = require("../constants/UserRoles");
const { UserStatus } = require("../constants/UserStatus");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: true,
};

/**
 * newUserSchema
 *
 */
const newUserSchema = Joi.object({
  userName: Joi.string().min(5).max(16).required().example("user00001"),
  email: Joi.string().email().required().example("user00001@gmail.com"),
  password: Joi.string().min(8).max(16).required().example("!5tr0ng@pa55w0rd"),
  // role: Joi.string().valid(...Object.values(Roles)),
  role: Joi.string().valid(Roles.USER),
  status: Joi.string().valid(UserStatus.ACTIVE),
});

/**
 *
 * @param {Object} userDTO
 * @returns userDTO object and error if any
 */
exports.validateNewUser = async (userDTO) => {
  return newUserSchema.validate(userDTO, options);
};

/**
 * loginSchema
 */
const loginSchema = Joi.object({
  userName: Joi.string().min(5).max(16).required().example("user00001"),
  password: Joi.string().min(8).max(16).required().example("!5tr0ng@pa55w0rd"),
});

/**
 *
 * @param {Object} loginDTO
 * @returns
 */
exports.validateLoginObject = async (loginDTO) => {
  return loginSchema.validate(loginDTO, options);
};

const userUpdateSchema = Joi.object({
  status: Joi.string().valid(...Object.values(UserStatus)),
  role: Joi.string().valid(...[Roles.MODERATOR, Roles.USER, Roles.ADMIN]),
});

exports.validateUserUpdateObject = async (userUpdateDTO) => {
  return userUpdateSchema.validate(userUpdateDTO, options);
};

exports.newUserSchema = newUserSchema;
exports.loginSchema = loginSchema;
exports.userUpdateSchema = userUpdateSchema;
