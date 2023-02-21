const Joi = require("joi");
const { emailSchema } = require("./joi.schemas");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: false,
  allowUnknown: true,
};

exports.getAllUsersQueryParams = {
  role: Joi.string().valid(...Object.values(Roles)),
  status: Joi.string().valid(...Object.values(UserStatus)),
  email: emailSchema,
  page: pageSchema,
  userName: userNameSchema,
  limit: limitSchema,
  sort_by: sortBySchema,
};

exports.getAllUsersQuerySchema = Joi.object({
  ...this.getAllUsersQueryParams,
});

exports.validateGetAllUsersQueryObject = async (queryObject) => {
  return ggetAllUsersQuerySchema.validate(queryObject, options);
};
