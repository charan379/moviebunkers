import { IEpisode } from "@models/interfaces/episode.interface";
import Joi from "joi";
import { ObjectIdSchema } from "./common.joi.schemas";
import { imageSchema, vedioSchema } from "./common.title.joi.schemas";


export const episodeSchema: Joi.ObjectSchema<IEpisode> = Joi.object({
    tv_show_id: ObjectIdSchema.required().example("64134d08661b4da2fb891d48"),
    season_id: ObjectIdSchema.required().example("64134d08661b4da2fb891d48"),
    air_date: Joi.date().example("2013-04-28").allow(null).allow(""),
    season_number: Joi.number().integer().required().example(3),
    episode_number: Joi.number().integer().required().example(5),
    name: Joi.string().required().example("Kissed by Fire"),
    still_path: Joi.string().example(
        "https://image.tmdb.org/t/p/w300/41CekEZyGvNLTJIJy7BqFDTitcC.jpg"
    ).allow(null).allow(""),
    overview: Joi.string().example(
        "The Hound is judged by the gods. Jaime is judged by men. Jon proves himself. Robb is betrayed. Tyrion learns the cost of weddings."
    ).allow(null).allow(""),
    runtime: Joi.number().integer().example(57).allow("").allow(null),
    directors: Joi.array().items(Joi.string().example("Alex Graves")).allow(null).allow(""),

    videos: Joi.array().items(vedioSchema).allow(null).allow(""),

    images: Joi.array().items(imageSchema).allow(null).allow("")
})