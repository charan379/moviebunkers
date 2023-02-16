const Joi = require("joi");
const { Roles } = require("../constants/UserRoles");

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
  userName: Joi.string().min(5).max(16).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  role: Joi.string().valid(...Object.values(Roles)),
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
  userName: Joi.string().min(5).max(16).required(),
  password: Joi.string().min(8).max(16).required(),
});

/**
 *
 * @param {Object} loginDTO
 * @returns
 */
exports.validateLoginObject = async (loginDTO) => {
  return loginSchema.validate(loginDTO, options);
};
