import { Types } from "mongoose";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import { IEpisode } from "./episode.interface";
import { AgeRatting, Cast, Language } from "src/@types";
import IUser from "./user.interface";

interface ITitle {
    _id: Types.ObjectId;
    title_type: TitleType;
    source: TitleSource;
    imdb_id: string;
    tmdb_id: number;
    title: string;
    original_title: string;
    original_language: Language;
    languages: Language[];
    tagline: string;
    poster_path: string;
    year: number;
    runtime: number;
    ratting: number;
    age_rattings: AgeRatting[];
    genres: string[];
    overview: string;
    production_companies: string[];
    production_countries: string[];
    status: string;
    in_production: boolean; // tv specific
    release_date: Date;
    providers: string[];
    directors: string[];
    created_by: string[]; // tv specific
    cast: Cast[];
    last_aired_date: Date; // tv specific
    last_episode_aired: IEpisode; // tv specific
    next_episode_to_air: IEpisode; // tv specific
    networks: string[]; // tv specific
    number_of_seasons: number; // tv specific
    number_of_episodes: number; // tv specific
    added_by: Types.ObjectId;
    last_modified_by: Types.ObjectId;
    title_owner: Partial<IUser>;
    last_modified_user: Partial<IUser>;
    createdAt: Date;
    updatedAt: Date;

}

export default ITitle;