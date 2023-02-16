const Joi = require("joi");
const { languageSchema, castSchema } = require("./joi.schemas");

/**
 * joi options
 */
const options = {
  abortEarly: false,
  stripUnknown: true,
};

/**
 *  new movie schema
 */

const movieSchema = Joi.object({
  // titile_type
  title_type: Joi.string()
    .valid(...["movie"])
    .required(),
  //  source
  source: Joi.string()
    .valid(...["tmdb", "imdb", "custom"])
    .required(),
  // imdb_id
  imdb_id: Joi.string(),
  // tmdb_id
  tmdb_id: Joi.number(),
  // title
  title: Joi.string().required(),
  // original_title
  original_title: Joi.string().required(),
  // original_language
  original_language: languageSchema.required(),
  // languages
  languages: Joi.array().items(languageSchema),
  // tagline
  tagline: Joi.string(),
  // poster_path
  poster_path: Joi.string(),
  // year
  year: Joi.number(),
  // runtime
  runtime: Joi.number(),
  // genres
  genres: Joi.array().items(Joi.string()),
  // overview
  overview: Joi.string(),
  // production_companies
  production_companies: Joi.array().items(Joi.string()),
  // production_countries
  production_countries: Joi.array().items(Joi.string()),
  // status
  status: Joi.string(),
  // release_date
  release_date: Joi.date(),
  // providers
  providers: Joi.array().items(Joi.string()),
  // directors
  directors: Joi.array().items(Joi.string()),
  // cast
  cast: Joi.array().items(castSchema),
});

exports.validateMovieObject = async (movieObject) => {
  return movieSchema.validate(movieObject, options);
};
