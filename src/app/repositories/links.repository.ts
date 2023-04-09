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


    /**
     * Updates a document in the database by its _id field
     * @param {Types.ObjectId} id - The ObjectId of the document to update
     * @param {Partial<ILink>} update - The fields to update in the document
     * @returns {Promise<ILink>} A Promise that resolves with the updated document
     * @throws {Error} Throws an error if an error occurs while updating the document
     */
    async updateById(id: Types.ObjectId, update: Partial<ILink>): Promise<ILink> {
        try {
            // Use Mongoose's findByIdAndUpdate function to update the document by its _id field
            const updatedDocument = await this.linkModel.findByIdAndUpdate(
                id, // The ObjectId of the document to update
                { $set: update }, // The fields to update in the document
                { new: true } // Option to return the updated document
            ).lean().exec();

            // If the document is not found, throw an error
            if (!updatedDocument) {
                throw new Error(`Link with id ${id} not found.`);
            }

            // Return the updated document
            return updatedDocument;
        } catch (error) {
            // If an error occurs, throw it to the caller of this method
            throw error;
        }
    }


}

export default LinksRepository