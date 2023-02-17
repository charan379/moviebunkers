const Joi = require("joi");

exports.languageSchema = Joi.object({
  "639_1_code": Joi.string().required().example("en"),
  english_name: Joi.string().required().example("English"),
  native_name: Joi.string().example("English"),
});

exports.castSchema = Joi.object({
  name: Joi.string().required().example("Brad Pitt"),
  character: Joi.string().example("Tyler Durden"),
});

exports.episodeSchema = Joi.object({
  air_date: Joi.date().example("2013-04-28"),
  episode_number: Joi.number().integer().required().example(5),
  season_number: Joi.number().integer().required().example(3),
  name: Joi.string().required().example("Kissed by Fire"),
  overview: Joi.string().example(
    "The Hound is judged by the gods. Jaime is judged by men. Jon proves himself. Robb is betrayed. Tyrion learns the cost of weddings."
  ),
  runtime: Joi.number().integer().example(57),
  still_path: Joi.string().example(
    "https://image.tmdb.org/t/p/w300/41CekEZyGvNLTJIJy7BqFDTitcC.jpg"
  ),
  directors: Joi.array().items(Joi.string().example("Alex Graves")),
});

exports.seasonSchema = Joi.object({
  air_date: Joi.date().example("2013-03-31"),
  season_number: Joi.number().required().example(3),
  episode_count: Joi.number().required().example("10"),
  name: Joi.string().required().example("Season 3"),
  overview: Joi.string().example(
    "Daenerys Targaryen--reunited with her dragons--attempts to raise an army in her quest for the Iron Throne."
  ),
  poster_path: Joi.string().example(
    "https://image.tmdb.org/t/p/w300/5MkZjRnCKiIGn3bkXrXfndEzqOU.jpg"
  ),
});
