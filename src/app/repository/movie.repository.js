const MovieModel = require("../models/movie.model");

//  add new movie
exports.newMovie = async (movieObj) => {
  return new Promise((resolve, reject) => {
    MovieModel.create(movieObj)
      .then((result) => {
        resolve(result._id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// find movie by _id
exports.findById = async (id) => {
  return new Promise((resolve, reject) => {
    MovieModel.findById(id)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get all movies in db
exports.findAll = async () => {
  return new Promise((resolve, reject) => {
    MovieModel.find({})
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get all movies in db with minimal projection
exports.findAllMinimal = async () => {
  return new Promise((resolve, reject) => {
    MovieModel.find(
      {},
      {
        _id: 1,
        title_type: 1,
        source: 1,
        imdb_id: 1,
        tmdb_id: 1,
        title: 1,
        poster_path: 1,
        year: 1,
      }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
