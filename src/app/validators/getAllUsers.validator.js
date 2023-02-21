const Joi = require("joi");
const { Roles } = require("../constants/UserRoles");
const { UserStatus } = require("../constants/UserStatus");
const { emailSchema, userNameSchema } = require("./joi.schemas");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: false,
  allowUnknown: true,
};

const getAllUsersQueryParams = {
  role: Joi.string().valid(...Object.values(Roles)),
  status: Joi.string().valid(...Object.values(UserStatus)),
  email: emailSchema,
  page: Joi.number().integer().example(1),
  userName: userNameSchema,
  limit: Joi.number().integer().example(5),
  sort_by: Joi.string().example("role.desc"),
};

const getAllUsersQuerySchema = Joi.object({
  ...getAllUsersQueryParams,
});

exports.validateGetAllUsersQueryObject = async (queryObject) => {
  return getAllUsersQuerySchema.validate(queryObject, options);
};
