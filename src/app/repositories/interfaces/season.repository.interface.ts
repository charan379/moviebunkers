import { ISeason } from "@models/interfaces/season.interface";
import { Types } from "mongoose";

interface ISeasonRepository {
    create(season: Partial<ISeason>): Promise<ISeason | null>;
    findById(id: Types.ObjectId): Promise<ISeason | null>;
    findByTvShowId(tvShowId: Types.ObjectId): Promise<ISeason[]>;
    updateById(id: Types.ObjectId, update: Partial<ISeason>): Promise<ISeason | null>;
    deleteById(id: Types.ObjectId): Promise<void>;
    deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void>;
}

export default ISeasonRepository;
