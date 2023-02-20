const Joi = require("joi");
const { TitleSources } = require("../constants/TitleSources");
const { TitleTypes } = require("../constants/TitleType");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: false,
  allowUnknown: true,
};

const titleSchema = Joi.object({
  title_type: Joi.string()
    .valid(...Object.values(TitleTypes))
    .required(),

  source: Joi.string()
    .valid(...Object.values(TitleSources))
    .required(),
});

exports.validateTitleObject = async (titleObject) => {
  return titleSchema.validate(titleObject, options);
};
