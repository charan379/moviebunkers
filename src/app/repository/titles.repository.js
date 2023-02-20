const TitleModel = require("../models/titles.model");

// find titles by _id
exports.findById = async (id) => {
  return TitleModel.findById(id);
};

// get title by tmdb_id
exports.findByTmdbId = async (tmdb_id) => {
  return TitleModel.findOne({ tmdb_id: tmdb_id });
};

// get title by imdb_id
exports.findByImdbId = async (imdb_id) => {
  return TitleModel.findOne({ imdb_id: imdb_id });
};

// get all titles in db with minimal projection
exports.findAllTitles = async ({ query, minimal, sort, page, limit }) => {
  const Minimalprojection = {
    _id: 1,
    title_type: 1,
    source: 1,
    imdb_id: 1,
    tmdb_id: 1,
    title: 1,
    poster_path: 1,
    year: 1,
  };

  const titlesCount = await TitleModel.find(query).countDocuments();

  const titlesList = await TitleModel.find(
    query,
    minimal === "true" ? Minimalprojection : {}
  )
    .limit(limit * 1)
    .sort(sort)
    .skip((page - 1) * limit);

  const result = {
    currentPage: page,
    totalPages: Math.ceil(titlesCount / limit),
    list: titlesList,
  };

  return result;
};
