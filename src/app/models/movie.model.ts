import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import mongoose, { Model, Schema } from "mongoose";
import IMovie from "./interfaces/movie.interface";


const movieSchema: Schema<IMovie> = new Schema<IMovie>(
    {
        // title_type
        title_type: {
            type: String,
            enum: [...Object.values(TitleType)],
            required: [true, "titile type required"],
        },
        // source
        source: {
            type: String,
            enum: [...Object.values(TitleSource)],
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
            type: Number,
        },
        // ratting
        ratting: {
            type: Number,
        },
        // age_ratting
        age_ratting: {
            type: Number,
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
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "titles",
    }
);

const MovieModel: Model<IMovie> = mongoose.model<IMovie>("movie", movieSchema);

export default MovieModel;