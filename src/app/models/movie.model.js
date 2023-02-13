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
    imdb_id: {
      type: String,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: {imdb_id: {$type: 'string'}},
      }
    },
    tmdb_id: {
      type: Number,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: {tmdb_id: {$type: 'int'}},
      }
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
      type: {
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
      _id: false
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
      _id: false,
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
      _id: false,
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
      _id: false,
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
      type: [String],
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
      _id: false,
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
      _id: false,
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
      _id: false,
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
      _id: false,
    },
    added_by: {
      type: Object,
      _id: false,
    },
    last_modified_by: {
      type: Object,
      _id: false,
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
