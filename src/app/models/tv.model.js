const mongoose = require("mongoose");

// tvSchema
const tvSchema = new mongoose.Schema(
  {
    // title_type
    title_type: {
      type: String,
      enum: ["tv"],
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
    // in_production
    in_production: {
      type: Boolean,
    },
    // created_by
    created_by: {
      type: [String],
    },
    // last_aired_date
    last_aired_date: {
      type: Date,
    },
    // last_episode_aired
    last_episode_aired: {
      type: Object,
      _id: false,
    },
    // next_episode_to_air
    next_episode_to_air: {
      type: Object,
      _id: false,
    },
    // networks
    networks: {
      type: [String],
      _id: false,
    },
    // number_of_seasons
    number_of_seasons: {
      type: Number,
    },
    // number_of_episodes
    number_of_episodes: {
      type: Number,
    },
    // seasons
    seasons: {
      type: [Object],
      _id: false,
    },
    // added_by
    added_by: {
      type: String,
    },
    // last_modified_by
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

// TvModel
const TvModel = mongoose.model("tv", tvSchema);

module.exports = TvModel;
