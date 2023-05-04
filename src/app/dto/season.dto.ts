import HttpCodes from "@constants/http.codes.enum";
import TitleException from "@exceptions/title.exeception";
import { ISeason } from "@models/interfaces/season.interface";
import { Image, Video } from "src/@types";


interface SeasonDTO {
    _id: string;
    tv_show_id: string;
    air_date: Date;
    season_number: number;
    episode_count: number;
    name: string;
    overview: string;
    poster_path: string;
    videos: Video[];
    images: Image[];
}

export default SeasonDTO;

export function iSeasonToSeasonDTOMapper(iSeason: ISeason): SeasonDTO {
    try {
        const seasonDTO: SeasonDTO = {
            _id: iSeason?._id?.toString() ?? "",
            tv_show_id: iSeason?.tv_show_id?.toString() ?? "",
            air_date: iSeason?.air_date ?? "",
            season_number: iSeason?.season_number ?? "",
            episode_count: iSeason?.episode_count ?? "",
            name: iSeason?.name ?? "",
            overview: iSeason?.overview ?? "",
            poster_path: iSeason?.poster_path ?? "",
            videos: iSeason?.videos ?? [],
            images: iSeason?.images ?? [],
        }
        return seasonDTO;
    } catch (error: any) {
        throw new TitleException(
            `Season DTO Mapping Failed`,
            HttpCodes.CONFLICT,
            error?.message,
            `iSeasonToSeasonDTOMapper.function()`)
    }
}
