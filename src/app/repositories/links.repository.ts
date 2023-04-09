import ILink from "@models/interfaces/ILinks";
import ILinksRespository from "./interfaces/links.repository.interface";
import { Model, Types } from "mongoose";
import LinkModel from "@models/links.model";
import { Service } from "typedi";

/**
 * A repository for interacting with the links collection in the database.
 */
@Service()
class LinksRepository implements ILinksRespository {
  private linkModel: Model<ILink>;

  /**
   * Creates a new instance of the LinksRepository class.
   */
  constructor() {
    // Initialize the linkModel property with the LinkModel object.
    this.linkModel = LinkModel;
  }

  /**
   * Creates a new document in the database with the given properties.
   * @param {Partial<ILink>} link - The properties of the new document to create
   * @returns {Promise<ILink>} A Promise that resolves to the created document
   * @throws {Error} Throws an error if an error occurs while creating the document
   */
  async create(link: Partial<ILink>): Promise<ILink> {
    try {
      // Use Mongoose's create method to create the new document with the given properties
      const createdLink = await this.linkModel.create<Partial<ILink>>(link);

      // Return the created document
      return createdLink;
    } catch (error) {
      // If an error occurs, throw it to the caller of this method
      throw error;
    }
  }

  /**
   * Fetches all links from the database that have a given parentId value
   * @param {Types.ObjectId} parentId - The ObjectId value to search for in the parentId field
   * @returns {Promise<ILink[]>} A Promise that resolves to an array of ILink objects that match the search criteria
   * @throws {Error} Throws an error if an error occurs while fetching the documents
   */
  async getAllByParentId(parentId: Types.ObjectId): Promise<ILink[]> {
    try {
      // Use Mongoose's find method to fetch all documents that have the given parentId value
      // The lean method is used to return plain JavaScript objects instead of Mongoose documents
      // An empty object is passed as the second argument to include all fields in the returned documents
      const links = await this.linkModel
        .find({ parentId: parentId }, {})
        .lean()
        .exec();

      // Return the array of links
      return links;
    } catch (error) {
      // If an error occurs, throw it to the caller of this method
      throw error;
    }
  }

  /**
   * Deletes a document from the database by its _id field
   * @param {Types.ObjectId} id - The ObjectId of the document to delete
   * @returns {Promise<void>} A Promise that resolves when the document is deleted
   * @throws {Error} Throws an error if an error occurs while deleting the document, or if the document is not found
   */
  async deleteById(id: Types.ObjectId): Promise<void> {
    try {
      // Use Mongoose's findByIdAndDelete function to delete the document by its _id field.
      // The lean method is used to return plain JavaScript objects instead of Mongoose documents
      const deletedDocument = await this.linkModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      // If the document is not found, throw an error
      if (!deletedDocument) {
        throw new Error(`Link with id ${id} not found.`);
      }

      // Document deleted successfully
      // You can optionally return the deleted document, but in this implementation, it is not necessary
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
      const updatedDocument = await this.linkModel
        .findByIdAndUpdate(
          id, // The ObjectId of the document to update
          { $set: update }, // The fields to update in the document
          { new: true } // Option to return the updated document
        )
        .lean()
        .exec();

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

export default LinksRepository;
