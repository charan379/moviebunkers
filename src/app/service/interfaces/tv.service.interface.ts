import TvDTO from "@dto/Tv.dto";


interface ITvService {
    createTv(tvDTO: Partial<TvDTO>): Promise<TvDTO>;
}

export default ITvService;