import { Schema } from "mongoose";


export const tvExtendableSchema: Schema = new Schema(
    {
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
            type: [{
                air_date: {
                    type: Date,
                },
                episode_count: {
                    type: Number
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
                    required: true,
                }
            }],
        },

    },
);


export default tvExtendableSchema;