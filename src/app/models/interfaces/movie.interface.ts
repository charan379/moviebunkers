import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import CastDTO from "@dto/cast.dto";
import LanguageDTO from "@dto/language.dto";



interface IMovie {
    title_type: TitleType;
    source: TitleSource;
    imdb_id: string;
    tmdb_id: number;
    title: string;
    original_title: string;
    original_language: LanguageDTO;
    languages: LanguageDTO[];
    tagline: string;
    poster_path: string;
    year: number;
    runtime: number;
    ratting: number;
    age_ratting: number;
    genres: string[];
    overview: string;
    production_companies: string[];
    production_countries: string[];
    status: string;
    release_date: Date;
    providers: string[];
    directors: string[];
    cast: CastDTO[];
    added_by: string;
    last_modified_by: string;
    createdAt: Date;
    updatedAt: Date;
}

export default IMovie;