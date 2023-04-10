import LinkDTO from "@dto/link.dto";
import ILink from "@models/interfaces/ILinks";

interface ILinksService {
  create(linkDto: Partial<ILink>): Promise<LinkDTO>;
  getLinksByParentId(parentId: string): Promise<LinkDTO[]>;
  deleteById(id: string): Promise<void>;
  updateById(id: string, update: Partial<ILink>): Promise<LinkDTO>;
  deleteManyByParentId(parentId: string): Promise<void>;
}

export default ILinksService;
