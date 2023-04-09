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
        try {
            return this.linkModel.create<Partial<ILink>>(link);
        } catch (error) {
            throw error
        }
    }

    getAllByParentId(parentId: Types.ObjectId): Promise<ILink[]> {
        try {
            return this.linkModel.find({ parentId: parentId }, {}).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    
    /**
     * Deletes a document from the database by its _id field
     * @param {Types.ObjectId} id - The ObjectId of the document to delete
     * @returns {Promise<void>} A Promise that resolves when the document is deleted
     * @throws {Error} Throws an error if an error occurs while deleting the document
     */
    async deleteById(id: Types.ObjectId): Promise<void> {
        try {
            // Use Mongoose's findByIdAndDelete function to delete the document by its _id field.
            // The lean method is used to return plain JavaScript objects instead of Mongoose documents
            await this.linkModel.findByIdAndDelete(id).lean().exec();
        } catch (error) {
            // If an error occurs, throw it to the caller of this method
            throw error;
        }
    }

    updateById(id: Types.ObjectId): Promise<ILink> {
        throw new Error("Method not implemented.");
    }

}

export default LinksRepository