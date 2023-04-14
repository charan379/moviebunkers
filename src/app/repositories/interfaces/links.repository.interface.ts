import ILink from "@models/interfaces/link.interface";
import mongoose from "mongoose";

interface ILinksRespository {
  create(link: Partial<ILink>): Promise<ILink>;
  getAllByParentId(parentId: mongoose.Types.ObjectId): Promise<ILink[]>;
  deleteById(id: mongoose.Types.ObjectId): Promise<void>;
  deleteManyByParentId(parentId: mongoose.Types.ObjectId): Promise<void>;
  updateById(
    id: mongoose.Types.ObjectId,
    update: Partial<ILink>
  ): Promise<ILink>;
}

export default ILinksRespository;
