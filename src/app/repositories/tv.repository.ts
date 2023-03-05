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
    
    create(tv: Partial<ITv>): Promise<ITv> {
        return this.tvModel.create<Partial<ITv>>(tv);
    }

}

export default TvRepository;