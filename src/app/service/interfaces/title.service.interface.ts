import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import { ObjectId } from "mongoose";


interface ITitleService {

    createTitle(titileDTO: Partial<TitleDTO>, userDTO: UserDTO): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;
    getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO>;
    getTitleByIdWithUserData(titleId: string, userId: ObjectId ): Promise<TitleDTO>
    getAllTitlesWithUserData(queryDTO: FindAllTitlesQueryDTO, userId: ObjectId): Promise<PageDTO>;
}

export default ITitleService;