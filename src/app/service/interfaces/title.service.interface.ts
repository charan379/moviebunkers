import LanguageDTO from "@dto/language.dto";
import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import { ObjectId } from "mongoose";


interface ITitleService {

    createTitle(titleDTO: Partial<TitleDTO>, userDTO: UserDTO): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;
    getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO>;
    getTitleByIdWithUserData(titleId: string, userId: ObjectId): Promise<TitleDTO>
    getAllTitlesWithUserData(queryDTO: FindAllTitlesQueryDTO, userId: ObjectId, userData: UserDataDTO): Promise<PageDTO>;
    getAllAvailableLanguages(): Promise<LanguageDTO[]>;
    getAllAvailableGenres(): Promise<string[]>;
    deleteTitleById(titleId: string): Promise<void>;
    updateTitleById(titleId: string, title: Partial<TitleDTO>): Promise<TitleDTO>;

}

export default ITitleService;