import ILink from "@models/interfaces/link.interface";
import ILinksRespository from "./interfaces/links.repository.interface";
import { Model, Types } from "mongoose";
import LinkModel from "@models/links.model";
import { Service } from "typedi";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

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
   * @throws {RepositoryException} Throws an RepositoryException if an error occurs while creating the document
   */
  async create(link: Partial<ILink>): Promise<ILink> {
    try {
      // Use Mongoose's create method to create the new document with the given properties
      const createdLink = await this.linkModel.create<Partial<ILink>>(link);

      // Return the created document
      return createdLink;
    } catch (error: any) {
      // If an error occurs during execution of the try block, catch it here and handle it
      // Create a new RepositoryException with details about the error and throw it to the caller of this method
      throw new RepositoryException(
        // Set the error message to the error's message, or null if it's undefined
        `${error?.message}`,
        // Set the HTTP status code to 500 (Internal Server Error)
        HttpCodes.INTERNAL_SERVER_ERROR,
        // Set the error stack trace to a stringified version of the error's stack, or null if it's undefined
        `${JSON.stringify(error?.stack)}`,
        // Set the location of the error to the LinksRepository class and create method
        `LinksRepository.class: create.method()`
      );
    }
  }

  /**
   * Fetches all links from the database that have a given parentId value
   * @param {Types.ObjectId} parentId - The ObjectId value to search for in the parentId field
   * @returns {Promise<ILink[]>} A Promise that resolves to an array of ILink objects that match the search criteria
   * @throws {RepositoryException} Throws an RepositoryException if an error occurs while fetching the documents
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
    } catch (error: any) {
      // If an error occurs during execution of the try block, catch it here and handle it
      // Create a new RepositoryException with details about the error and throw it to the caller of this method
      throw new RepositoryException(
        // Set the error message to the error's message, or null if it's undefined
        `${error?.message}`,
        // Set the HTTP status code to 500 (Internal Server Error)
        HttpCodes.INTERNAL_SERVER_ERROR,
        // Set the error stack trace to a stringified version of the error's stack, or null if it's undefined
        `${JSON.stringify(error?.stack)}`,
        // Set the location of the error to the LinksRepository class and getAllByParentId method
        `LinksRepository.class: getAllByParentId.method()`
      );
    }
  }

  /**
   * Updates a document in the database by its _id field
   * @param {Types.ObjectId} id - The ObjectId of the document to update
   * @param {Partial<ILink>} update - The fields to update in the document
   * @returns {Promise<ILink>} A Promise that resolves with the updated document
   * @throws {RepositoryException} Throws an RepositoryException if an error occurs while updating the document
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
        throw new RepositoryException(
          `Link with id ${id} not found`,
          HttpCodes.BAD_REQUEST,
          `Failed to update link with id: ${id}`,
          `LinksRepository.class: updateById.method()`
        );
      }

      // Return the updated document
      return updatedDocument;
    } catch (error: any) {
      // If an error occurs, check if it is an instance of MoviebunkersException
      if (error instanceof MoviebunkersException) {
        // If it is, simply throw the error to the caller of this method
        throw error
      } else {
        // If it's not a MoviebunkersException, wrap it in a new RepositoryException and throw it to the caller
        throw new RepositoryException(
          // Set the error message to the error's message, or null if it's undefined
          `${error?.message}`,
          // Set the HTTP status code to 500 (Internal Server Error)
          HttpCodes.INTERNAL_SERVER_ERROR,
          // Set the error stack trace to a stringified version of the error's stack, or null if it's undefined
          `${JSON.stringify(error?.stack)}`,
          // Set the location of the error to the LinksRepository class and updateById method
          `LinksRepository.class: updateById.method()`
        );
      }

    }
  }

  /**
   * Deletes a document from the database by its _id field
   * @param {Types.ObjectId} id - The ObjectId of the document to delete
   * @returns {Promise<void>} A Promise that resolves when the document is deleted
   * @throws {RepositoryException} Throws an RepositoryException if an error occurs while deleting the document, or if the document is not found
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
        // Throw a new RepositoryException indicating that the link with the given id was not found
        throw new RepositoryException(
          // Set the error message to a string that includes the id of the link that was not found
          `Link with id ${id} not found`,
          // Set the HTTP status code to 400 (Bad Request)
          HttpCodes.BAD_REQUEST,
          // Set the error message to indicate that the link deletion failed for the link with the given id
          `Failed to delete link with id: ${id}`,
          // Set the location of the error to the LinksRepository class and deleteById method
          `LinksRepository.class: deleteById.method()`
        );
      }

      // Document deleted successfully
      // You can optionally return the deleted document, but in this implementation, it is not necessary
    } catch (error: any) {
      // If an error occurs, check if it is an instance of MoviebunkersException
      if (error instanceof MoviebunkersException) {
        // If it is, simply throw the error to the caller of this method
        throw error
      } else {
        // If it's not a MoviebunkersException, wrap it in a new RepositoryException and throw it to the caller
        throw new RepositoryException(
          // Set the error message to the error's message, or null if it's undefined
          `${error?.message}`,
          // Set the HTTP status code to 500 (Internal Server Error)
          HttpCodes.INTERNAL_SERVER_ERROR,
          // Set the error stack trace to a stringified version of the error's stack, or null if it's undefined
          `${JSON.stringify(error?.stack)}`,
          // Set the location of the error to the LinksRepository class and deleteById method
          `LinksRepository.class: deleteById.method()`
        );
      }

    }
  }

  /**
   * Deletes all link documents that belong to the parent document with the specified ID.
   *
   * @param {Types.ObjectId} parentId - ID of the parent document to delete links for.
   * @returns {Promise<void>} A Promise that resolves when the documents are deleted
   * @throws {RepositoryException} If the deletion fails for any reason.
   */
  async deleteManyByParentId(parentId: Types.ObjectId): Promise<void> {
    try {
      // Call the deleteMany method of the links repository to delete all links with the specified parent ID
      await this.linkModel.deleteMany({ parentId: parentId }).lean().exec();
    } catch (error: any) {
      // If any error occurs during the deletion process, re-throw it to be handled by the caller
      throw new RepositoryException(
        // Set the error message to the error's message, or null if it's undefined
        `${error?.message}`,
        // Set the HTTP status code to 500 (Internal Server Error)
        HttpCodes.INTERNAL_SERVER_ERROR,
        // Set the error stack trace to a stringified version of the error's stack, or null if it's undefined
        `${JSON.stringify(error?.stack)}`,
        // Set the location of the error to the LinksRepository class and deleteManyByParentId method
        `LinksRepository.class: deleteManyByParentId.method()`
      );
    }
  }
}

export default LinksRepository;
