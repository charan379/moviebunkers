const { JoiInvalidMovie } = require("../errors/MovieErrors");
const { MovieException } = require("../utils/Exceptions");
const { validateMovieObject } = require("../validators/movie.validator");
const movieRepository = require("../repository/movie.repository");

exports.addNewMovie = async (requestBody) => {
  const { value: movieDTO, error: error } = await validateMovieObject(
    requestBody
  );

  if (error) {
    throw new MovieException(JoiInvalidMovie(error.message));
  }

  return (newMovie = await movieRepository.newMovie({ ...movieDTO }));
};
