import BaseTitleDTO from "./base.title.dto";
import EpisodeDTO from "./episode.dto";
import SeasonDTO from "./season.dto";
import TitleAuthorDTO from "./title.author.dto";


interface TvDTO extends BaseTitleDTO, TitleAuthorDTO {

    in_production?: boolean;
    created_by?: string[];
    last_aired_date?: Date;
    last_episode_aired?: EpisodeDTO;
    next_episode_to_air?: EpisodeDTO;
    networks?: string[];
    number_of_seasons?: number;
    number_of_episodes?: number;
    seasons?: SeasonDTO[];
}

export default TvDTO;