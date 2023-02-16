const {
  InvalidTitleType,
  TitleAlreadyExists,
} = require("../errors/TitleErrros");
const { TitleException } = require("../utils/Exceptions");
const movieService = require("./movies.service");
const tvService = require("./tv.service");
const titlesRepository = require("../repository/titles.repository");

exports.newTitle = async (requestBody) => {
  const titile_type = requestBody.title_type;
  const tmdb_id = requestBody.tmdb_id;
  const imdb_id = requestBody.imdb_id;

  if (tmdb_id) {
    if (await titlesRepository.findByTmdbId(tmdb_id)) {
      throw new TitleException(TitleAlreadyExists(`tmdb_id : ${tmdb_id}`));
    }
  }

  if (imdb_id) {
    if (await titlesRepository.findByImdbId(imdb_id)) {
      throw new TitleException(TitleAlreadyExists(`imdb_id : ${imdb_id}`));
    }
  }

  if (!titile_type) {
    throw new TitleException(InvalidTitleType("title_type is required"));
  } else {
    if (!["movie", "tv"].includes(titile_type)) {
      throw new TitleException(InvalidTitleType(titile_type));
    }
  }

  if (titile_type === "movie") {
    return await movieService.addNewMovie(requestBody);
  }

  if (titile_type === "tv") {
    return await tvService.addNewTv(requestBody);
  }
};
