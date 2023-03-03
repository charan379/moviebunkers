import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import CastDTO from "./cast.dto";
import EpisodeDTO from "./episode.dto";
import LanguageDTO from "./language.dto";
import SeasonDTO from "./season.dto";


interface TitleDTO {
    title_type: TitleType;
    source: TitleSource;
    imdb_id?: string;
    tmdb_id?: number;
    title: string;
    original_title: string;
    original_language: LanguageDTO;
    languages?: LanguageDTO[];
    tagline?: string;
    poster_path?: string;
    year?: number;
    runtime?: number;
    ratting?: number;
    age_ratting?: number;
    genres: string[];
    overview?: string;
    production_companies?: string[];
    production_countries?: string[];
    status: string;
    release_date?: Date;
    providers?: string[];
    directors?: string[];
    cast?: CastDTO[];
    in_production?: boolean;
    created_by?: string[];
    last_aired_date?: Date;
    last_episode_aired?: EpisodeDTO;
    next_episode_to_air?: EpisodeDTO;
    networks?: string[];
    number_of_seasons?: number;
    number_of_episodes?: number;
    seasons?: SeasonDTO[];
    added_by: string;
    last_modified_by?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default TitleDTO;