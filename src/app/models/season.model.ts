import mongoose, { Model, Schema } from "mongoose";
import { ISeason } from "./interfaces/season.interface";


const seasonSchema: Schema<ISeason> = new Schema<ISeason>(
    {
        tv_show_id: {
            type: Schema.Types.ObjectId,
            required: [true, "tv_show_id is required"],
            index: true,
        },
        air_date: {
            type: Date
        },
        season_number: {
            type: Number,
            required: [true, "season_number is required"]
        },
        episode_count: {
            type: Number,
        },
        name: {
            type: String,
            required: [true, "season name is required"]
        },
        overview: {
            type: String,
        },
        poster_path: {
            type: String,
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "seasons"
    }
);

const SeasonModel: Model<ISeason> = mongoose.model<ISeason>('season', seasonSchema);

export default SeasonModel;