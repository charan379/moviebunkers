import ILink from "@models/interfaces/link.interface";
import mongoose from "mongoose";

interface ILinksRespository {
  create(link: Partial<ILink>): Promise<ILink | null>;
  findById(id: mongoose.Types.ObjectId): Promise<ILink | null>;
  findAllByParentId(parentId: mongoose.Types.ObjectId, options: { limit: number, skip: number, sortBy: any }): Promise<ILink[]>;
  deleteById(id: mongoose.Types.ObjectId): Promise<void>;
  deleteManyByParentId(parentId: mongoose.Types.ObjectId): Promise<void>;
  updateById(id: mongoose.Types.ObjectId, update: Partial<ILink>): Promise<ILink | null>;
}

export default ILinksRespository;
