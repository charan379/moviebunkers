const MovieModel = require("../models/movie.model");

//  add new movie
exports.newMovie = async (movieObj) => {
  return MovieModel.create(movieObj);
};
