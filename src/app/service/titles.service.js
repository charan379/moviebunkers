const {
  InvalidTitleType,
  TitleAlreadyExists,
} = require("../errors/TitleErrros");
const {
  TitleException,
  MovieBunkersException,
} = require("../utils/Exceptions");
const movieService = require("./movies.service");
const tvService = require("./tv.service");
const titlesRepository = require("../repository/titles.repository");
const { json } = require("express");

exports.newTitle = async (requestBody) => {
  const title_type = requestBody.title_type;
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

  if (!title_type) {
    throw new TitleException(InvalidTitleType("title_type is required"));
  } else {
    if (!["movie", "tv"].includes(title_type)) {
      throw new TitleException(InvalidTitleType(title_type));
    }
  }

  if (title_type === "movie") {
    return await movieService.addNewMovie(requestBody);
  }

  if (title_type === "tv") {
    return await tvService.addNewTv(requestBody);
  }
};

exports.findAllMinimal = async () => {
  const result = await titlesRepository.findAllMinimal();
  if (result.length > 0) {
    return result;
  } else {
    throw new MovieBunkersException(TitleNotFound("get all"));
  }
};
