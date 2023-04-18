import { ISeason } from "@models/interfaces/season.interface";
import Joi from "joi";
import { ObjectIdSchema } from "./common.joi.schemas";


export const seasonSchema: Joi.ObjectSchema<ISeason> = Joi.object({
    tv_show_id: ObjectIdSchema.required().example("64134d08661b4da2fb891d48"),
    air_date: Joi.date().example("2013-03-31").allow(null).allow(""),
    name: Joi.string().required().example("Season 3"),
    season_number: Joi.number().required().example(3),
    episode_count: Joi.number().required().example("10"),
    poster_path: Joi.string()
        .example("https://image.tmdb.org/t/p/w300/5MkZjRnCKiIGn3bkXrXfndEzqOU.jpg")
        .allow(null)
        .allow(""),

    overview: Joi.string()
        .example(
            "Daenerys Targaryen--reunited with her dragons--attempts to raise an army in her quest for the Iron Throne."
        )
        .allow(null)
        .allow(""),
})