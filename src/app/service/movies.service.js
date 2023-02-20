const { JoiInvalidMovie } = require("../errors/MovieErrors");
const { MovieException } = require("../utils/Exceptions");
const { validateMovieObject } = require("../validators/movie.validator");
const movieRepository = require("../repository/movie.repository");

/**
 * newMovie
 * @param {Object} requestBody
 * @returns
 */
exports.newMovie = async (requestBody) => {
  /**
   * validate requestBody
   * and
   * store cleaned body in movieDTO
   * store errors in error
   */
  const { value: movieDTO, error: error } = await validateMovieObject(
    requestBody
  );

  /**
   * if errors persist throw exception
   */
  if (error) {
    throw new MovieException(JoiInvalidMovie(error.message));
  }

  /**
   * create new movie
   * and
   * return it
   */
  return await movieRepository.createMovie({ ...movieDTO });
};
