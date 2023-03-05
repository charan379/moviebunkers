import TitleType from "@constants/titile.types.enum";
import LanguageDTO from "./language.dto";
import MovieDTO from "./movie.dto";
import TvDTO from "./Tv.dto";


interface TitleDTO extends MovieDTO, TvDTO, TitleAuthorDTO {
    _id?: string;
}

export default TitleDTO;

export interface FindAllTitlesQueryDTO {
    search: string;
    title_type: TitleType;
    genre: string;
    year: number;
    language: string;
    minimal?: boolean,
    page?: number,
    sort_by?: string,
    limit?: number
}