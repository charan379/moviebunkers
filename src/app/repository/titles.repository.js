const TitleModel = require("../models/titles.model");

/**
 * find title by objectId _id
 * @param {ObjectId} id
 * @returns
 */
exports.findById = async (id) => {
  /**
   * find title by _id and return it
   */
  return TitleModel.findById(id);
};

/**
 * find title by tmdb_id
 * @param {Number} tmdb_id
 * @returns
 */
exports.findByTmdbId = async (tmdb_id) => {
  /**
   * find title by tmdb_id and return it
   */
  return TitleModel.findOne({ tmdb_id: tmdb_id });
};

/**
 * find title by imdb_id
 * @param {String} imdb_id
 * @returns
 */
exports.findByImdbId = async (imdb_id) => {
  /**
   * find title by imdb_id and return it
   */
  return TitleModel.findOne({ imdb_id: imdb_id });
};

/**
 * find all titles by given query
 * @param {Object} param0
 * @returns
 */
exports.findAllTitles = async ({ query, minimal, sort, page, limit }) => {
  /**
   * Minimal Projection
   */
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

  /**
   * count total documents found for given query
   * and
   * store count in a variable titlesCount
   */
  const titlesCount = await TitleModel.find(query).countDocuments();

  /**
   * retrive all documents with given query
   * and
   * store it in titlesList variable
   */
  const titlesList = await TitleModel.find(
    query,
    minimal === "true" ? Minimalprojection : {} // if minimal = true then retrive minimal else retrive all
  )
    .limit(limit * 1) // number documents to be retrived
    .sort(sort) // sort options object {}
    .skip((page - 1) * limit); // number of documents to be skipped

  return {
    // current page number
    currentPage: page,
    // total pages found for given query
    totalPages: Math.ceil(titlesCount / limit),
    // current page result Array<Title>
    list: titlesList,
  };
};
