import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";


interface ITitleService {

    createTitle(titileDTO: Partial<TitleDTO>): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;
    getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO>;
}

export default ITitleService;