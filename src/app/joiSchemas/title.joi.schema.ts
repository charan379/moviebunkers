import ITitle from "@models/interfaces/title.interface";
import Joi from "joi";
import { castSchema, countryCertification, episodeSchema, languageSchema } from "./common.title.joi.schemas";
import TitleSource from "@constants/title.souces.enum";
import TitleType from "@constants/titile.types.enum";


const titleSchema: Joi.ObjectSchema<ITitle> = Joi.object({
    // titile_type
    title_type: Joi.string()
        .valid(...[...Object.values(TitleType)])
        .required(),
    //  source
    source: Joi.string()
        .valid(...[...Object.values(TitleSource)])
        .required(),
    // imdb_id
    imdb_id: Joi.string().example("tt0137523"),
    // tmdb_id
    tmdb_id: Joi.number().integer().example(550),
    // title
    title: Joi.string().required().example("Fight Club"),
    // original_title
    original_title: Joi.string().required().example("Fight Club"),
    // original_language
    original_language: languageSchema.required(),
    // languages
    languages: Joi.array().items(languageSchema),
    // tagline
    tagline: Joi.string().example("Mischief. Mayhem. Soap").allow(null).allow(""),
    // poster_path
    poster_path: Joi.string()
        .example("https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg").allow(null).allow(""),
    // year
    year: Joi.number().integer().example(1999).allow(null).allow(""),
    // runtime
    runtime: Joi.number().integer().example(139),
    // ratting
    ratting: Joi.number().allow(null).allow(""),
    // age_ratting
    age_rattings: Joi.array().items(countryCertification).required(),
    // genres
    genres: Joi.array().items(Joi.string().example("Thriller")),
    // overview
    overview: Joi.string()
        .example(
            'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.'
        ).allow(null).allow(""),
    // production_companies
    production_companies: Joi.array()
        .items(Joi.string().example("20th Century Fox")).allow(null),
    // production_countries
    production_countries: Joi.array()
        .items(Joi.string().example("United States of America")).allow(null),
    // status
    status: Joi.string().example("Released"),
    // release_date
    release_date: Joi.date().example("1999-10-15"),
    // providers
    providers: Joi.array()
        .items(Joi.string().example("Amazon Prime")).allow(null).allow(null),
    // directors
    directors: Joi.array()
        .items(Joi.string().example("David Fincher")).allow(null),
    // cast
    cast: Joi.array().items(castSchema),
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
})

export default titleSchema;