import TvDTO from "@dto/Tv.dto";
import { Service } from "typedi";
import ITvService from "./interfaces/tv.service.interface";


@Service()
class TvService implements ITvService {
    createTv(tvDTO: Partial<TvDTO>): Promise<TvDTO> {
        throw new Error("Method not implemented.");
    }
}

export default TvService;