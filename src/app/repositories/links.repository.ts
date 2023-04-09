import ILink from "@models/interfaces/ILinks";
import ILinksRespository from "./interfaces/links.repository.interface";
import { Model, Types } from "mongoose";
import LinkModel from "@models/links.model";
import { Service } from "typedi";


@Service()
class LinksRepository implements ILinksRespository {

    private linkModel: Model<ILink>;

    constructor() {
        this.linkModel = LinkModel
    }

    /**
     * 
     * @param link 
     */
    create(link: Partial<ILink>): Promise<ILink> {
        return this.linkModel.create<Partial<ILink>>(link);
    }

    getAllByParentId(parentId: Types.ObjectId): Promise<ILink[]> {
        try {
            return this.linkModel.find({ parentId: parentId }, {}).lean().exec();
        } catch (error) {
            throw error;
        }
        throw new Error("Method not implemented.");
    }
    deleteById(id: Types.ObjectId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateById(id: Types.ObjectId): Promise<ILink> {
        throw new Error("Method not implemented.");
    }

}

export default LinksRepository