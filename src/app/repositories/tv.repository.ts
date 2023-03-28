import ITv from "@models/interfaces/tv.interface";
import TvModel from "@models/tv.model";
import { Model } from "mongoose";
import { Service } from "typedi";
import ITvRepository from "./interfaces/tv.repository.interface";


@Service()
class TvRepository implements ITvRepository {

    private tvModel: Model<ITv>;

    constructor() {
        this.tvModel = TvModel;
    }

    /**
     * create()
     * @param tv 
     * @returns 
     */
    create(tv: Partial<ITv>): Promise<ITv> {
        return this.tvModel.create<Partial<ITv>>(tv);
    }

    /**
     * updateTvById()
     * @param tvId 
     * @param tv 
     */
    updateTvById(tvId: string, tv: Partial<ITv>): Promise<ITv | null> {

        return this.tvModel
            .findByIdAndUpdate(tvId, { $set: { ...tv } }, { returnDocument: "after" })
            .lean()
            .exec();

    }
}

export default TvRepository;