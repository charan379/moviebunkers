import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";


interface ITitleService {

    createTitle(titileDTO: Partial<TitleDTO>, userDTO: UserDTO): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;
    getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO>;
}

export default ITitleService;