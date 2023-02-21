const Joi = require("joi");
const { TitleTypes } = require("../constants/TitleType");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: false,
  allowUnknown: true,
};

const getAllTitlesQueryParams = {
  search: Joi.string().example("Fight Club"),
  tmdb_id: Joi.number().integer().example(500),
  year: Joi.number().integer().example(1999),
  title_type: Joi.string().valid(...Object.values(TitleTypes)),
  genre: Joi.string().example('Action'),
  language: Joi.string().example('en'),
  minimal: Joi.boolean().example(false),
  page: Joi.number().integer().example(1),
  limit: Joi.number().integer().example(5),
  sort_by: Joi.string().example("role.desc"),
};

const getAllTitlesQuerySchema = Joi.object({
  ...getAllTitlesQueryParams,
});

exports.validateGetAllTitlesQueryObject = async (queryObject) => {
  return getAllTitlesQuerySchema.validate(queryObject, options);
};
