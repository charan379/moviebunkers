import Joi from "joi";
import baseTitleSchema from "./base.joi.title.schema";
import { episodeSchema, seasonSchema, titleAuthorSchema } from "./common.title.joi.schemas";




const tvSchema: Joi.ObjectSchema = Joi.object({

    // base title schema
    ...baseTitleSchema,

    //  in_production
    in_production: Joi.boolean().example(false),
    //  created_by
    created_by: Joi.array()
        .items(Joi.string().example("David Benioff")),
    //  last_aired_date
    last_aired_date: Joi.date().example("2019-05-19"),
    //  last_episode_aired
    last_episode_aired: episodeSchema,
    //  next_episode_to_air
    next_episode_to_air: episodeSchema,
    //  networks
    networks: Joi.array().items(Joi.string().example("HBO")),
    // number_of_seasons
    number_of_seasons: Joi.number().integer().example(8),
    //  number_of_episodes
    number_of_episodes: Joi.number().integer().example(73),
    //  seasons
    seasons: Joi.array().items(seasonSchema),

    // title author schema
    ...titleAuthorSchema,

});

export default tvSchema;