import TvDTO from "@dto/Tv.dto";
import tvSchema from "@joiSchemas/tv.joi.schema";
import ITv from "@models/interfaces/tv.interface";
import TvRepository from "@repositories/tv.repository";
import JoiValidator from "@utils/joi.validator";
import { Inject, Service } from "typedi";
import ITvService from "./interfaces/tv.service.interface";


@Service()
class TvService implements ITvService {

    private tvRepository: TvRepository;

    constructor(@Inject() tvRepository: TvRepository){
        this.tvRepository = tvRepository;
    }

    async createTv(tvDTO: Partial<TvDTO>): Promise<TvDTO> {
        
        const validTV: TvDTO = await JoiValidator(tvSchema, tvDTO, {abortEarly:false, stripUnknown: true, allowUnknown: false});
        
        const newMovie = await this.tvRepository.create(validTV as Partial<ITv>) as TvDTO;

        return newMovie;
    }
}

export default TvService;