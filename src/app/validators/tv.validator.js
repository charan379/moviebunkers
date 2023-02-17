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
  imdb_id: Joi.string().example('tt0944947'),
  // tmdb_id
  tmdb_id: Joi.number().integer().example(1399),
  // title
  title: Joi.string().required().example('Game of Thrones'),
  // original_title
  original_title: Joi.string().required().example('Game of Thrones'),
  // original_language
  original_language: languageSchema.required(),
  // languages
  languages: Joi.array().items(languageSchema),
  // tagline
  tagline: Joi.string().example('Winter Is Coming'),
  // poster_path
  poster_path: Joi.string().example('https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg'),
  // year
  year: Joi.number().integer().example(2011),
  // runtime
  runtime: Joi.number().integer().example(60),
  // genres
  genres: Joi.array().items(Joi.string().example('Action & Adventure')),
  // overview
  overview: Joi.string().example('Seven noble families fight for control of the mythical land of Westeros.'),
  // production_companies
  production_companies: Joi.array().items(Joi.string().example('Television 360')),
  // production_countries
  production_countries: Joi.array().items(Joi.string().example('United States of America')),
  // status
  status: Joi.string().example('Ended'),
  // release_date
  release_date: Joi.date().example('2011-04-17'),
  // providers
  providers: Joi.array().items(Joi.string().example('Hotstar')),
  // directors
  directors: Joi.array().items(Joi.string().example('Director name')),
  // cast
  cast: Joi.array().items(castSchema),
  //  in_production
  in_production: Joi.boolean().example(false),
  //  created_by
  created_by: Joi.array().items(Joi.string().example('David Benioff')),
  //  last_aired_date
  last_aired_date: Joi.date().example('2019-05-19'),
  //  last_episode_aired
  last_episode_aired: episodeSchema,
  //  next_episode_to_air
  next_episode_to_air: episodeSchema,
  //  networks
  networks: Joi.array().items(Joi.string().example('HBO')),
  // number_of_seasons
  number_of_seasons: Joi.number().integer().example(8),
  //  number_of_episodes
  number_of_episodes: Joi.number().integer().example(73),
  //  seasons
  seasons: Joi.array().items(seasonSchema),
});

exports.validateTvObject = async (tvObject) => {
  return tvSchema.validate(tvObject, options);
};

exports.tvSchema = tvSchema;
