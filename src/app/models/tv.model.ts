import mongoose, { Model, Schema } from "mongoose";
import ITv from "./interfaces/tv.interface";
import { movieSchema } from "./movie.model";


const tvSchema: Schema<ITv> = new Schema<ITv>({
    ...movieSchema,

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
},
    // {
    //     timestamps: {
    //         createdAt: true,
    //         updatedAt: true,
    //     },
    //     collection: "titles",
    // }
);


const TvModel: Model<ITv> = mongoose.model<ITv>("tv", tvSchema);

export default TvModel;