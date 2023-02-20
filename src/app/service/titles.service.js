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
const { buildSortObj } = require("../utils/build.sort.object");

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

exports.findAll = async (requestQuery) => {
  let query = {};
  let sort = { createdAt: "desc" };
  let page = 1;
  let limit = 5;
  let minimal = 'false';

  const nonQueryFields = ["sort_by", "page", "limit", "minimal"];

  query = { ...requestQuery };

  nonQueryFields.forEach((element) => {
    delete query[element];
  });

  // page
  if (requestQuery.page) {
    page = requestQuery.page;
  }

  // limit
  if (requestQuery.limit) {
    limit = requestQuery.limit;
  }

  // sort_by
  if (requestQuery.sort_by) {
    sort = await buildSortObj(requestQuery.sort_by);
  }

  // minimal
  if (requestQuery.minimal) {
    minimal = requestQuery.minimal;
  }

  const result = await titlesRepository.findAllTitles({query,minimal,sort, page, limit});

  return result;
};
