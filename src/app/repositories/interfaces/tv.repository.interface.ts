import ITv from "@models/interfaces/tv.interface";


interface ITvRepository {
    create(tv: Partial<ITv>): Promise<ITv>;
}

export default ITvRepository;