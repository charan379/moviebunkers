import HttpCodes from "@constants/http.codes.enum";
import TitleException from "@exceptions/title.exeception";
import { IEpisode } from "@models/interfaces/episode.interface";
import { Image, Video } from "src/@types";


interface EpisodeDTO {
    _id: string;
    tv_show_id: string;
    season_id: string;
    air_date: Date;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    runtime: number;
    still_path: string;
    directors: string[];
    videos: Video[];
    images: Image[];
}
export default EpisodeDTO;

export function iEpisodeToEpisodeDTOMapper(iEpisode: IEpisode): EpisodeDTO {
    try {
        const episodeDTO: EpisodeDTO = {
            _id: iEpisode?._id?.toString() ?? "",
            tv_show_id: iEpisode?.tv_show_id?.toString() ?? "",
            season_id: iEpisode?.season_id?.toString() ?? "",
            air_date: iEpisode?.air_date ?? "",
            episode_number: iEpisode?.episode_number ?? "",
            season_number: iEpisode?.season_number ?? "",
            name: iEpisode?.name ?? "",
            overview: iEpisode?.overview ?? "",
            runtime: iEpisode?.runtime ?? "",
            still_path: iEpisode?.still_path ?? "",
            directors: iEpisode?.directors ?? [],
            videos: iEpisode?.videos ?? [],
            images: iEpisode?.images ?? [],

        }
        return episodeDTO;
    } catch (error: any) {
        throw new TitleException(
            `Episode DTO Mapping Failed: ${error?.message}`,
            HttpCodes.CONFLICT,
            error?.message,
            `iEpisodeToEpisodeDTOMapper.function()`)
    }
}
