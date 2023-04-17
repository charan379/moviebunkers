import EpisodeDTO from "@dto/episode.dto";
import { IEpisode } from "@models/interfaces/episode.interface";


interface IEpisodeService {
    create(episode: Partial<IEpisode>): Promise<EpisodeDTO>;
    getEpisodesByTvSeasonId(tvShowId: string, seasonId: string): Promise<EpisodeDTO[]>;
    updatedById(id: string, update: Partial<IEpisode>): Promise<EpisodeDTO>;
    deleteById(id: string): Promise<void>;
    deleteManyByTvSeasonId(tvShowId: string, seasonId: string): Promise<void>;
    deleteManyByTvShowId(tvShowId: string): Promise<void>;

}

export default IEpisodeService