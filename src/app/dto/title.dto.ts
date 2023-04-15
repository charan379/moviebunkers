import Country from "@constants/country.enum";
import TitleType from "@constants/titile.types.enum";
import MovieDTO from "./movie.dto";
import TitleAuthorDTO from "./title.author.dto";
import TvDTO from "./Tv.dto";
import { Types } from "mongoose";


interface TitleDTO extends MovieDTO, TvDTO, TitleAuthorDTO {
    _id?: Object | string | Types.ObjectId;
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