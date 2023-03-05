import EpisodeDTO from "@dto/episode.dto";
import SeasonDTO from "@dto/season.dto";
import IMovie from "./movie.interface";



interface ITv extends IMovie {
    in_production: boolean;
    created_by: string[];
    last_aired_date: Date;
    last_episode_aired: EpisodeDTO;
    next_episode_to_air: EpisodeDTO;
    networks: string[];
    number_of_seasons: number;
    number_of_episodes: number;
    seasons: SeasonDTO[];
}

export default ITv;