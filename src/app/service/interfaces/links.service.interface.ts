import LinkDTO from "@dto/link.dto";
import ILink from "@models/interfaces/link.interface";

interface ILinksService {
  create(linkDto: Partial<ILink>): Promise<LinkDTO>;
  getLinkById(id: string): Promise<LinkDTO>;
  getLinksByParentId(parentId: string, options: { limit: number, skip: number, sortBy: string }): Promise<LinkDTO[]>;
  deleteById(id: string): Promise<void>;
  updateById(id: string, update: Partial<ILink>): Promise<LinkDTO>;
  deleteManyByParentId(parentId: string): Promise<void>;
}

export default ILinksService;
