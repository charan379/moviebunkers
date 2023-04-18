import { IEpisode } from "@models/interfaces/episode.interface";
import { Types } from "mongoose";



interface IEpisodeRepository {
    create(episode: Partial<IEpisode>): Promise<IEpisode | null>;
    findById(id: Types.ObjectId): Promise<IEpisode | null>;
    findByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<IEpisode[]>;
    updateById(id: Types.ObjectId, update: Partial<IEpisode>): Promise<IEpisode | null>;
    deleteById(id: Types.ObjectId): Promise<void>;
    deleteManyByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<void>;
    deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void>;
}

export default IEpisodeRepository;