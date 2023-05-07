import SeasonDTO from "@dto/season.dto";
import { ISeason } from "@models/interfaces/season.interface";



interface ISeasonService {
    create(season: Partial<ISeason>): Promise<SeasonDTO>;
    getSeasonById(id: string): Promise<SeasonDTO>;
    getSeasonsByTvShowId(tvShowId: string, options: { limit: number, skip: number, sortBy: string }): Promise<SeasonDTO[]>
    updateSeasonById(id: string, update: Partial<ISeason>): Promise<SeasonDTO>;
    deleteSeasonById(id: string): Promise<void>;
    deleteAllSeasonByTVShowId(tvShowId: string): Promise<void>;
}

export default ISeasonService;