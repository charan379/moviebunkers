import ILink from "@models/interfaces/ILinks";
import mongoose from "mongoose";


interface ILinksRespository {
    create(link: Partial<ILink>): Promise<ILink>;
    getAllByParentId(parentId: mongoose.Types.ObjectId): Promise<ILink[]>;
    deleteById(id: mongoose.Types.ObjectId): Promise<void>;
    updateById(id: mongoose.Types.ObjectId): Promise<ILink>;
};

export default ILinksRespository;