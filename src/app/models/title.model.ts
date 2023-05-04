import mongoose, { Model, Schema } from "mongoose";
import ITitle from "./interfaces/title.interface";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";


const titleSchema: Schema<ITitle> = new Schema<ITitle>(
    {
        // title_type
        title_type: {
            type: String,
            enum: Object.values(TitleType),
            required: [true, "titile_type required"],
        },

        // source
        source: {
            type: String,
            enum: Object.values(TitleSource),
            required: [true, "title source requried"],
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
            type: {
                ISO_639_1_code: {
                    type: String,
                    required: [true, "Language ISO_639_1_code is required"],
                },
                english_name: {
                    type: String,
                    required: [true, "Language english_name is required"],
                },
                native_name: {
                    type: String,
                    required: [true, "Language native_name is required"],
                },
            },
            _id: false,
        },

        // lanuages
        languages: {
            type: [{
                ISO_639_1_code: {
                    type: String,
                    required: [true, "Language ISO_639_1_code is required"],
                },
                english_name: {
                    type: String,
                    required: [true, "Language english_name is required"],
                },
                native_name: {
                    type: String,
                    required: [true, "Language native_name is required"],
                },
            }],
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
            type: Number,
        },

        // ratting
        ratting: {
            type: Number,
        },

        // age_ratting
        age_rattings: {
            type: [{
                country: {
                    type: String,
                },
                ratting: {
                    type: String,
                },
            }],
            _id: false,
        },

        // genres
        genres: {
            type: [String],
            default: ["Unknown"],
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
        },

        // status
        status: {
            type: String,
            default: "unknown",
        },

        // in_production
        in_production: { // TV specific
            type: Boolean,
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

        // created_by
        created_by: { // TV specific
            type: [String],
        },

        // cast
        cast: {
            type: [{
                profile_path: {
                    type: String,
                },
                name: {
                    type: String,
                },
                character: {
                    type: String,
                },
            }],
            _id: false,
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

        // external_ids
        external_ids: {
            type: Object,
            _id: false,
        },

        // videos
        videos: {
            type: [{
                name: {
                    type: String,
                    default: ""
                },
                site: {
                    type: String,
                    default: ""
                },
                key: {
                    type: String,
                    default: ""
                },
                size: {
                    type: Number,
                    default: 0
                },
                type: {
                    type: String,
                    default: ""
                },
                official: {
                    type: Boolean,
                    default: false
                },
                published_at: {
                    type: Date,
                }
            }],
            _id: false,
        },

        // images
        images: {
            type: [{
                aspect_ratio: {
                    type: Number,
                    default: 0,
                },
                height: {
                    type: Number,
                    default: 0,
                },
                width: {
                    type: Number,
                    default: 0,
                },
                type: {
                    type: String,
                    default: ""
                },
                file_path: {
                    type: String,
                    default: ""
                }
            }],
            _id: false,
        },

        // 
        // added_by
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },

        // last_modified_by
        last_modified_by: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "titles",
    }
);

titleSchema.index({ title_type: 1 })

const TitleModel: Model<ITitle> = mongoose.model<ITitle>("title", titleSchema);

export default TitleModel;