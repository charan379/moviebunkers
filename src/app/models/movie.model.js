const mongoose = require("mongoose");

// movieSchema
const movieSchema = new mongoose.Schema(
  {
    // title_type
    title_type: {
      type: String,
      enum: ["movie"],
      required: [true, "titile required"],
    },
    // source
    source: {
      type: String,
      enum: ["tmdb", "imdb", "custom"],
    },
    // imdb_id
    imdb_id: {
      type: String,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { imdb_id: { $type: "string" } },
      },
    },
    // tmdb_id
    tmdb_id: {
      type: Number,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { tmdb_id: { $type: "int" } },
      },
    },
    // title
    title: {
      type: String,
      required: [true, "title is Required"],
    },
    // original_title
    original_title: {
      type: String,
      required: [true, "originalTitle is Required"],
    },
    // original_language
    original_language: {
      type: Object,
      _id: false,
    },
    languages: {
      type: [Object],
      _id: false,
    },
    // tagline
    tagline: {
      type: String,
    },
    // poster_path
    poster_path: {
      type: String,
    },
    // year
    year: {
      type: Number,
    },
    // runtime
    runtime: {
      type: String,
    },
    // genres
    genres: {
      type: [String],
      default: ["unknown"],
    },
    // overview
    overview: {
      type: String,
    },
    // production_companies
    production_companies: {
      type: [String],
    },
    // production_countries
    production_countries: {
      type: [String],
      _id: false,
    },
    // status
    status: {
      type: String,
      default: "unknown",
    },
    // release_date
    release_date: {
      type: Date,
    },
    // providers
    providers: {
      type: [String],
    },
    // directors
    directors: {
      type: [String],
    },
    // cast
    cast: {
      type: [Object],
      _id: false,
    },
    added_by: {
      type: String,
    },
    last_modified_by: {
      type: String,
    },
  },
  {
    collection: "titles",
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

// movieModel
const MovieModel = mongoose.model("movie", movieSchema);

module.exports = MovieModel;
