import LinkDTO from "@dto/link.dto";
import ILink from "@models/interfaces/ILinks";


interface ILinksService {
    create(linkDto: Partial<ILink>): Promise<LinkDTO>;
    getAllByParentId(parentId: string): Promise<LinkDTO[]>;
    deleteById(id: string): Promise<void>;
    updateById(id: string): Promise<LinkDTO>;
}

export default ILinksService;