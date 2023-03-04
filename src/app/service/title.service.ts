import TitleDTO from "@dto/title.dto";
import { Service } from "typedi";
import ITitleService from "./interfaces/title.service.interface";


@Service()
class TitleService implements ITitleService {
    createTitle(titileDTO: Partial<TitleDTO>): Promise<TitleDTO> {
        throw new Error("Method not implemented.");
    }
    getTitleById(id: string): Promise<TitleDTO> {
        throw new Error("Method not implemented.");
    }  
}

export default TitleService;