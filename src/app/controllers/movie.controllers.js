const movieRepository = require("../repository/movie.repository");
const errorResponse = require("../utils/ErrorResponse");
//  add new movie
exports.newMovie = async (req, res, next) => {
  try {
    await movieRepository.newMovie(req.body.result).then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.send(error.message);
  }
};

// find movie by id
exports.findById = async (req, res, next) => {
  try {
    await movieRepository.findById(req.params.id).then((result) => {
      if (result === null) {
        res.status(404).json(errorResponse(404, "Movie Not Found"));
      } else {
        res.status(200).json({
          success: true,
          result: result,
        });
      }
      res.send(result);
    });
  } catch (error) {
    if (error.message.startsWith("Cast")) {
      res.status(404).json(errorResponse(404, "Invalid Movie Id"));
    }
  }
};

//  find all movies
exports.findAll = async (req, res, next) => {
  try {
    let repository = movieRepository.findAll();
    if (req.query.minimal === "true") {
      repository = movieRepository.findAllMinimal();
    }
    await repository.then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          success: true,
          total_results: result.length,
          result: result,
        });
      } else {
        res.status(404).json(errorResponse(404, "Got Empty Result"));
      }
    });
  } catch (error) {
    res.status(501).json(errorResponse(501, "Internal Server Error"));
  }
};
