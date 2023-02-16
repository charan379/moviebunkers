const Joi = require("joi");
const {
  castSchema,
  languageSchema,
  episodeSchema,
  seasonSchema,
} = require("./joi.schemas");

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

const tvSchema = Joi.object({
  // titile_type
  title_type: Joi.string()
    .valid(...["tv"])
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
  //  in_production
  in_production: Joi.boolean(),
  //  created_by
  created_by: Joi.array().items(Joi.string()),
  //  last_aired_date
  last_aired_date: Joi.date(),
  //  last_episode_aired
  last_episode_aired: episodeSchema,
  //  next_episode_to_air
  next_episode_to_air: episodeSchema,
  //  networks
  networks: Joi.array().items(Joi.string()),
  // number_of_seasons
  number_of_seasons: Joi.number(),
  //  number_of_episodes
  number_of_episodes: Joi.number(),
  //  seasons
  seasons: Joi.array().items(seasonSchema),
});

exports.validateTvObject = async (tvObject) => {
  return tvSchema.validate(tvObject, options);
};
