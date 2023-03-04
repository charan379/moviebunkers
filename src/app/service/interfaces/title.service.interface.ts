import TitleDTO from "@dto/title.dto";


interface ITitleService {

    createTitle(titileDTO: Partial<TitleDTO>): Promise<TitleDTO>;
    getTitleById(id: string): Promise<TitleDTO>;

}

export default ITitleService;