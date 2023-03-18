import TvDTO from "@dto/Tv.dto";
import { UserDTO } from "@dto/user.dto";
import tvSchema from "@joiSchemas/tv.joi.schema";
import ITv from "@models/interfaces/tv.interface";
import TvRepository from "@repositories/tv.repository";
import JoiValidator from "@utils/joi.validator";
import { ObjectId } from "mongoose";
import { Inject, Service } from "typedi";
import ITvService from "./interfaces/tv.service.interface";


@Service()
class TvService implements ITvService {

    private tvRepository: TvRepository;

    constructor(@Inject() tvRepository: TvRepository) {
        this.tvRepository = tvRepository;
    }

    async createTv(tvDTO: Partial<TvDTO>, userDTO: UserDTO): Promise<TvDTO> {

        const validTV: TvDTO = await JoiValidator(tvSchema, tvDTO, { abortEarly: false, stripUnknown: true, allowUnknown: false });

        const tv: TvDTO = { ...validTV, added_by: userDTO._id as ObjectId, last_modified_by: userDTO._id as ObjectId }
        
        const newMovie = await this.tvRepository.create(tv as Partial<ITv>) as TvDTO;

        return newMovie;
    }
}

export default TvService;