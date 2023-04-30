import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import ITitle from "@models/interfaces/title.interface";
import { Language, Page } from "src/@types";


interface ITitleService {

    createTitle(titleDTO: Partial<ITitle>, userDTO: UserDTO): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;
    getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<Page<Partial<TitleDTO>>>;
    getTitleByIdWithUserData(titleId: string, userId: string): Promise<TitleDTO>
    getAllTitlesWithUserData(queryDTO: FindAllTitlesQueryDTO, userId: string, userData: UserDataDTO): Promise<Page<Partial<TitleDTO>>>;
    getAllAvailableLanguages(): Promise<Language[]>;
    getAllAvailableGenres(): Promise<string[]>;
    deleteTitleById(titleId: string): Promise<void>;
    updateTitleById(titleId: string, title: Partial<ITitle>): Promise<TitleDTO>;

}

export default ITitleService;