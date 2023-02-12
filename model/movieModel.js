const mongoose = require("mongoose");

// movieSchema
const movieSchema = new mongoose.Schema(
  {
    title_type: {
      type: String,
      enum: ["tv", "movie"],
      required: [true, "titile required"],
    },
    source: {
      type: String,
      enum: ["tmdb", "imdb", "custom"],
    },
    tmdb_id: {
      type: Number,
      unique: true,
    },
    imdb_id: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "title is Required"],
    },
    original_title: {
      type: String,
      required: [true, "originalTitle is Required"],
    },
    original_language: {
      "639_1_code": {
        type: String,
        required: [true, "639_1_code is required"],
      },
      english_name: {
        type: String,
        required: [true, "english_name is required"],
      },
      native_name: {
        type: String,
      },
    },
    languages: {
      type: [
        {
          "639_1_code": {
            type: String,
            required: [true, "639_1_code is required"],
          },
          english_name: {
            type: String,
            required: [true, "english_name is required"],
          },
          native_name: {
            type: String,
          },
        },
      ],
    },
    tagline: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    year: {
      type: Number,
    },
    runtime: {
      type: String,
    },
    genres: {
      type: [
        {
          id: {
            type: Number,
          },
          name: {
            type: String,
            default: "unknown",
          },
        },
      ],
      default: {},
    },
    overview: {
      type: String,
    },
    production_companies: {
      type: [
        {
          name: {
            type: String,
          },
        },
      ],
    },
    production_countries: {
      type: [
        {
          iso_3166_1: {
            type: String,
          },
          name: {
            type: String,
          },
        },
      ],
    },
    status: {
      type: String,
      default: "unknown",
    },
    release_date: {
      type: Date,
    },
    providers: {
      type: [String],
    },
    directors: {
      type: [
        {
          name: {
            type: String,
          },
        },
      ],
    },
    cast: {
      type: [
        {
          name: {
            type: String,
          },
          character: {
            type: String,
          },
        },
      ],
    },
    in_production: {
      type: Boolean,
    },
    created_by: {
      type: [
        {
          name: {
            type: String,
          },
        },
      ],
    },
    last_aired_date: {
      type: Date,
    },
    last_episode_aired: {
      type: Object,
    },
    next_episode_to_air: {
      type: Object,
    },
    networks: {
      type: [
        {
          name: {
            type: String,
          },
          origin_country: {
            type: String,
          },
        },
      ],
    },
    number_of_seasons: {
      type: Number,
    },
    number_of_episodes: {
      type: Number,
    },
    seasons: {
      type: [
        {
          air_date: {
            type: Date,
          },
          episode_count: {
            type: Number,
          },
          id: {
            type: Number,
          },
          name: {
            type: String,
          },
          overview: {
            type: String,
          },
          poster_path: {
            type: String,
          },
          season_number: {
            type: Number,
          },
          tmdb_show_id: {
            type: Number,
          },
        },
      ],
    },
    added_by: {
      type: Object,
    },
    last_modified_by: {
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

// movieModel

const MovieModel = mongoose.model("movies", movieSchema);

module.exports = MovieModel;
