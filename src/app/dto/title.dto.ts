import Country from "@constants/country.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import { AgeRatting, Cast, Language } from "src/@types";
import EpisodeDTO, { iEpisodeToEpisodeDTOMapper } from "./episode.dto";
import { UserDTO, iuserToUserDTOMapper } from "./user.dto";
import ITitle from "@models/interfaces/title.interface";
import TitleException from "@exceptions/title.exeception";
import HttpCodes from "@constants/http.codes.enum";

interface TitleDTO {
    _id: string;
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
    last_episode_aired: EpisodeDTO; // tv specific
    next_episode_to_air: EpisodeDTO; // tv specific
    networks: string[]; // tv specific
    number_of_seasons: number; // tv specific
    number_of_episodes: number; // tv specific
    added_by: string;
    last_modified_by: string;
    title_owner?: UserDTO
    last_modified_user?: UserDTO;
    seenByUser?: boolean;
    unseenByUser?: boolean;
    starredByUser?: boolean;
    favouriteByUser?: boolean;
    createdAt: Date;
    updatedAt: Date;

}

export function ititleToTitleDTOMapper(iTitle: ITitle): TitleDTO {
    try {
        const titleDTO: TitleDTO = {
            _id: iTitle?._id?.toString() ?? "",
            title_type: iTitle?.title_type ?? "",
            source: iTitle?.source ?? "",
            imdb_id: iTitle?.imdb_id ?? "",
            tmdb_id: iTitle?.tmdb_id ?? "",
            title: iTitle?.title ?? "",
            original_title: iTitle?.original_title ?? "",
            original_language: iTitle?.original_language ?? "",
            languages: iTitle?.languages ?? "",
            tagline: iTitle?.tagline ?? "",
            poster_path: iTitle?.poster_path ?? "",
            year: iTitle?.year ?? "",
            runtime: iTitle?.runtime ?? "",
            ratting: iTitle?.ratting ?? "",
            age_rattings: iTitle?.age_rattings ?? "",
            genres: iTitle?.genres ?? "",
            overview: iTitle?.overview ?? "",
            production_companies: iTitle?.production_companies ?? "",
            production_countries: iTitle?.production_countries ?? "",
            status: iTitle?.status ?? "",
            in_production: iTitle?.in_production ?? "",
            release_date: iTitle?.release_date ?? "",
            providers: iTitle?.providers ?? "",
            directors: iTitle?.directors ?? "",
            created_by: iTitle?.created_by ?? "",
            cast: iTitle?.cast ?? "",
            last_aired_date: iTitle?.last_aired_date ?? "",
            last_episode_aired: iEpisodeToEpisodeDTOMapper(iTitle?.last_episode_aired) ?? "",
            next_episode_to_air: iEpisodeToEpisodeDTOMapper(iTitle?.next_episode_to_air) ?? "",
            networks: iTitle?.networks ?? "",
            number_of_seasons: iTitle?.number_of_seasons ?? "",
            number_of_episodes: iTitle?.number_of_episodes ?? "",
            added_by: iTitle?.added_by?.toString() ?? "",
            last_modified_by: iTitle?.last_modified_by?.toString() ?? "",
            title_owner: iuserToUserDTOMapper(iTitle?.title_owner, { withPassword: false }) ?? "",
            last_modified_user: iuserToUserDTOMapper(iTitle?.last_modified_user, { withPassword: false }) ?? "",
            seenByUser: iTitle?.seenByUser,
            unseenByUser: iTitle?.unseenByUser,
            starredByUser: iTitle?.starredByUser,
            favouriteByUser: iTitle?.favouriteByUser,
            createdAt: iTitle?.createdAt ?? "",
            updatedAt: iTitle?.updatedAt ?? "",
        }

        return titleDTO;
    } catch (error: any) {
        throw new TitleException(
            `Title DTO Mapping Failed`,
            HttpCodes.CONFLICT,
            error?.message,
            `ititleToTitleDTOMapper.function()`)
    }
}
export default TitleDTO;

export interface FindAllTitlesQueryDTO {
    search: string;
    title_type: TitleType;
    genre: string;
    language: string;
    movie: number;
    tv: number;
    starred: number;
    favourite: number;
    seen: number;
    "age.gte": number;
    "age.lte": number;
    country: Country;
    sort_by?: string,
    limit?: number
    pageNo?: number,
    minimal?: boolean,
}