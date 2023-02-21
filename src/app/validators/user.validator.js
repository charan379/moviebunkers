const Joi = require("joi");
const { Roles } = require("../constants/UserRoles");
const { UserStatus } = require("../constants/UserStatus");
const {
  passwordSchema,
  userNameSchema,
  emailSchema,
} = require("./joi.schemas");

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
  userName: userNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
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
  userName: userNameSchema.required(),
  password: passwordSchema.required(),
});

/**
 *
 * @param {Object} loginDTO
 * @returns
 */
exports.validateLogin = async (loginDTO) => {
  return loginSchema.validate(loginDTO, options);
};

const userUpdateSchema = Joi.object({
  status: Joi.string().valid(...Object.values(UserStatus)),
  role: Joi.string().valid(...[Roles.MODERATOR, Roles.USER, Roles.ADMIN]),
});

exports.validateUserUpdate = async (userUpdateDTO) => {
  return userUpdateSchema.validate(userUpdateDTO, options);
};

exports.newUserSchema = newUserSchema;
exports.loginSchema = loginSchema;
exports.userUpdateSchema = userUpdateSchema;
