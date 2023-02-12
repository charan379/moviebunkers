const MovieModel = require("../model/movieModel");

exports.newMovie = async (req, res, next) => {
  try {
    const movieObj = {
      title_type: "tv",
      tmdb_id: "3241010",
      imdb_id: "tt35423sq32",
      title: "Matix",
      original_title: "Matrix",
      original_language: {
        "639_1_code": "en",
        english_name: "English",
        native_name: "English",
      },
      source: "tmdb",
      next_episode_to_air: null,
    };
    

    const newMovie = await MovieModel.create(movieObj);
    console.log(newMovie);

  } catch (error) {
    console.log(error.message)
  }
};
