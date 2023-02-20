const MovieModel = require("../models/movie.model");

/**
 * create new movie
 * @param {Object} movieObj 
 * @returns 
 */
exports.createMovie = async (movieObj) => {
  /**
   * create new movie document and return it
   */
  return MovieModel.create(movieObj);
};
