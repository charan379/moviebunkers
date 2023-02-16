const Joi = require("joi");

exports.languageSchema = Joi.object({
  "639_1_code": Joi.string().required(),
  english_name: Joi.string().required(),
  native_name: Joi.string(),
});

exports.castSchema = Joi.object({
  name: Joi.string().required(),
  character: Joi.string(),
});

exports.episodeSchema = Joi.object({
  air_date: Joi.date(),
  episode_number: Joi.number().required(),
  season_number: Joi.number().required(),
  name: Joi.string().required(),
  overview: Joi.string(),
  runtime: Joi.number(),
  still_path: Joi.string(),
});

exports.seasonSchema = Joi.object({
  air_date: Joi.date(),
  season_number: Joi.number().required(),
  episode_count: Joi.number().required(),
  name: Joi.string().required(),
  overview: Joi.string(),
  poster_path: Joi.string(),
});
