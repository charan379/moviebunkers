import TitleType from "@constants/titile.types.enum";
import Joi from "joi";
import baseTitleSchema from "./base.joi.title.schema";
import { episodeSchema, seasonSchema, titleAuthorSchema } from "./common.title.joi.schemas";




const tvSchema: Joi.ObjectSchema = baseTitleSchema.keys({
    title_type: Joi.string()
        .valid(TitleType.TV)
        .required(),
    //  in_production
    in_production: Joi.boolean().example(false),
    //  created_by
    created_by: Joi.array()
        .items(Joi.string().example("David Benioff")).allow(null),
    //  last_aired_date
    last_aired_date: Joi.date().example("2019-05-19").allow(null).allow(""),
    //  last_episode_aired
    last_episode_aired: episodeSchema.allow(null),
    //  next_episode_to_air
    next_episode_to_air: episodeSchema.allow(null),
    //  networks
    networks: Joi.array().items(Joi.string().example("HBO")).allow(null),
    // number_of_seasons
    number_of_seasons: Joi.number().integer().example(8),
    //  number_of_episodes
    number_of_episodes: Joi.number().integer().example(73),
    //  seasons
    seasons: Joi.array().items(seasonSchema).allow(null),
})

export default tvSchema;