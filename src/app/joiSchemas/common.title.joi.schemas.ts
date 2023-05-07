import Country from "@constants/country.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import Joi from "joi";
import { ObjectIdSchema } from "./common.joi.schemas";

export const sortSkipLimitSchema: Joi.ObjectSchema = Joi.object({
    sort_by: Joi.string().example("createdAt.desc"),
    limit: Joi.number().integer().example(5),
    skip: Joi.number().integer().example(2),
})

export const externalIdsSchema: Joi.ObjectSchema = Joi.object({
    imdb_id: Joi.string().allow(null).allow(""),
    freebase_mid: Joi.string().allow(null).allow(""),
    freebase_id: Joi.string().allow(null).allow(""),
    tvdb_id: Joi.number().integer().allow(null).allow(""),
    tvrage_id: Joi.number().integer().allow(null).allow(""),
    wikidata_id: Joi.string().allow(null).allow(""),
    facebook_id: Joi.string().allow(null).allow(""),
    instagram_id: Joi.string().allow(null).allow(""),
    twitter_id: Joi.string().allow(null).allow(""),
});

export const vedioSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().example("GAME OF THRONES - SEASON 1- TRAILER"),
    site: Joi.string().example("YouTube"),
    key: Joi.string().example("bjqEWgDVPe0"),
    size: Joi.number().integer().example(1080),
    type: Joi.string().example("Trailer"),
    official: Joi.boolean().example(true),
    published_at: Joi.date().example("2017-02-20"),
});

export const imageSchema: Joi.ObjectSchema = Joi.object({
    aspect_ratio: Joi.number().example(1.778),
    height: Joi.number().integer().example(1080),
    width: Joi.number().integer().example(1920),
    type: Joi.string().example("backdrop"),
    file_path: Joi.string().example('https://image.tmdb.org/t/p/original/gfLe4nKLyYl4V5x62QZ6jRGEolA.jpg'),
});

export const languageSchema: Joi.ObjectSchema = Joi.object({
    ISO_639_1_code: Joi.string().required().example("en"),
    english_name: Joi.string().required().example("English"),
    native_name: Joi.string().example("English"),
});

export const castSchema: Joi.ObjectSchema = Joi.object({
    profile_path: Joi.string().example("https://image.tmdb.org/t/p/w92/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg").allow("").allow(null),
    name: Joi.string().required().example("Brad Pitt"),
    character: Joi.string().example("Tyler Durden").allow("").allow(null),
});

export const episodeSchema: Joi.ObjectSchema = Joi.object({
    air_date: Joi.date().example("2013-04-28").allow(null).allow(""),
    episode_number: Joi.number().integer().required().example(5),
    season_number: Joi.number().integer().required().example(3),
    name: Joi.string().required().example("Kissed by Fire"),
    overview: Joi.string().example(
        "The Hound is judged by the gods. Jaime is judged by men. Jon proves himself. Robb is betrayed. Tyrion learns the cost of weddings."
    ).allow(null).allow(""),
    runtime: Joi.number().integer().example(57).allow("").allow(null),
    still_path: Joi.string().example(
        "https://image.tmdb.org/t/p/w300/41CekEZyGvNLTJIJy7BqFDTitcC.jpg"
    ).allow(null).allow(""),
    directors: Joi.array().items(Joi.string().example("Alex Graves")).allow(null).allow(""),
});

export const titleAuthorSchema: Joi.ObjectSchema = Joi.object({
    // added_by
    added_by: ObjectIdSchema.required().example("6411c06ab4be7d8da5338cf7"),
    // last_modified_by
    last_modified_by: ObjectIdSchema.required().example("6411c06ab4be7d8da5338cf7"),

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
    search: Joi.string().example("Fight Club").allow(""),
    genre: Joi.string().example('Action').allow(""),
    language: Joi.string().example('en').allow(""),
    movie: Joi.number().integer().example(1).min(0).max(1).required(),
    tv: Joi.number().integer().example(1).min(0).max(1).required(),
    starred: Joi.number().integer().example(1).min(0).max(1).required(),
    favourite: Joi.number().integer().example(1).min(0).max(1).required(),
    seen: Joi.number().integer().example(1).min(-1).max(1).required(),
    "age.gte": Joi.number().min(0).max(26).example(8),
    "age.lte": Joi.number().min(0).max(26).example(12),
    country: Joi.string().example("IN").valid(...Object.values(Country)).required(),
    sort_by: Joi.string().example("createdAt.desc"),
    limit: Joi.number().integer().example(5),
    pageNo: Joi.number().integer().example(1),
    minimal: Joi.boolean().example(false),
});