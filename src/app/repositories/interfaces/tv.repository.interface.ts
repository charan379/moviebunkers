import ITv from "@models/interfaces/tv.interface";


interface ITvRepository {
    create(tv: Partial<ITv>): Promise<ITv>;
    updateTvById(tvId: string, tv: Partial<ITv>): Promise<ITv | null>;
}

export default ITvRepository;