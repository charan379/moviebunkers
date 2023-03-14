import Country from "@constants/country.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import Joi from "joi";

export const languageSchema: Joi.ObjectSchema = Joi.object({
    ISO_639_1_code: Joi.string().required().example("en"),
    english_name: Joi.string().required().example("English"),
    native_name: Joi.string().example("English"),
});

export const castSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required().example("Brad Pitt"),
    character: Joi.string().example("Tyler Durden"),
});

export const episodeSchema: Joi.ObjectSchema = Joi.object({
    air_date: Joi.date().example("2013-04-28").allow(null).allow(""),
    episode_number: Joi.number().integer().required().example(5),
    season_number: Joi.number().integer().required().example(3),
    name: Joi.string().required().example("Kissed by Fire"),
    overview: Joi.string().example(
        "The Hound is judged by the gods. Jaime is judged by men. Jon proves himself. Robb is betrayed. Tyrion learns the cost of weddings."
    ).allow(null).allow(""),
    runtime: Joi.number().integer().example(57),
    still_path: Joi.string().example(
        "https://image.tmdb.org/t/p/w300/41CekEZyGvNLTJIJy7BqFDTitcC.jpg"
    ).allow(null).allow(""),
    directors: Joi.array().items(Joi.string().example("Alex Graves")).allow(null).allow(""),
});

export const seasonSchema: Joi.ObjectSchema = Joi.object({
    air_date: Joi.date().example("2013-03-31").allow(null).allow(""),
    season_number: Joi.number().required().example(3),
    episode_count: Joi.number().required().example("10"),
    name: Joi.string().required().example("Season 3"),
    overview: Joi.string()
        .example(
            "Daenerys Targaryen--reunited with her dragons--attempts to raise an army in her quest for the Iron Throne."
        )
        .allow(null)
        .allow(""),
    poster_path: Joi.string()
        .example("https://image.tmdb.org/t/p/w300/5MkZjRnCKiIGn3bkXrXfndEzqOU.jpg")
        .allow(null)
        .allow(""),
});

export const titleAuthorSchema: Joi.ObjectSchema = Joi.object({
    // added_by
    added_by: Joi.string().example("user001"),
    // last_modified_by
    last_modified_by: Joi.string().example("user002"),

});

export const countryCertification: Joi.ObjectSchema = Joi.object({
    country: Joi.string().required().example("IN"),
    ratting: Joi.string().required().example("A"),
});

export const newTitleInitialCheckSchema: Joi.ObjectSchema = Joi.object({

    title_type: Joi.string()
        .valid(...Object.values(TitleType))
        .required(),

    source: Joi.string()
        .valid(...Object.values(TitleSource))
        .required(),
});

export const getAllTitlesQuerySchema = Joi.object({
    search: Joi.string().example("Fight Club"),
    genre: Joi.string().example('Action'),
    language: Joi.string().example('en'),
    movie: Joi.number().integer().example(1).min(0).max(1).required(),
    tv: Joi.number().integer().example(1).min(0).max(1).required(),
    starred: Joi.number().integer().example(1).min(0).max(1).required(),
    favourite: Joi.number().integer().example(1).min(0).max(1).required(),
    seen: Joi.number().integer().example(1).min(-1).max(1).required(),
    "age.gte": Joi.number().min(2).max(26).example(8),
    "age.lte": Joi.number().min(2).max(26).example(12),
    country: Joi.string().example("IN").valid(...Object.values(Country)).required(),
    sort_by: Joi.string().example("createdAt.desc"),
    limit: Joi.number().integer().example(5),
    page: Joi.number().integer().example(1),
    minimal: Joi.boolean().example(false),
});