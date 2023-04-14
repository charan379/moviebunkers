import { ISeason } from "@models/interfaces/season.interface";
import { Types } from "mongoose";

interface ISeasonRepository {
    findByTvShowId(tvShowId: Types.ObjectId): Promise<ISeason[]>;
    updateById(id: Types.ObjectId, update: Partial<ISeason>): Promise<ISeason | null>;
    deleteById(id: Types.ObjectId): Promise<void>;
    deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void>;
}

export default ISeasonRepository;
