import mongoose, { Model, Schema } from "mongoose";
import { IEpisode } from "./interfaces/episode.interface";


const episodeSchema: Schema<IEpisode> = new Schema<IEpisode>(
    {
        tv_show_id: {
            type: Schema.Types.ObjectId,
            required: [true, "tv_show_id is required"],
            index: true,
        },
        season_id: {
            type: Schema.Types.ObjectId,
            required: [true, "season_id is requried"],
            index: true,
        },
        air_date: {
            type: Date
        },
        season_number: {
            type: Number,
            required: [true, "season_number is required"]
        },
        episode_number: {
            type: Number,
            required: [true, "episode_number is required"]
        },
        name: {
            type: String,
            required: [true, "season name is required"]
        },
        overview: {
            type: String,
        },
        runtime: {
            type: Number,
        },
        still_path: {
            type: String,
        },
        directors: {
            type: [String],
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "episodes"
    }
);

const EpisodeModel: Model<IEpisode> = mongoose.model<IEpisode>('episode', episodeSchema);

export default EpisodeModel;