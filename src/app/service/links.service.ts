import LinkDTO, { ilinkToLinkDTOMapper } from "@dto/link.dto";
import ILinksService from "./interfaces/links.service.interface";
import { Inject, Service } from "typedi";
import LinksRepository from "@repositories/links.repository";
import ILink from "@models/interfaces/link.interface";
import mongoose from "mongoose";
import LinkException from "@exceptions/link.exception";
import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * The `LinksService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting links.
 */
@Service()
class LinksService implements ILinksService {
  private linksRepository: LinksRepository;

  /**
   * Creates an instance of LinksService.
   * @param {LinksRepository} linksRepository - Instance of LinksRepository injected by typedi.
   */
  constructor(@Inject() linksRepository: LinksRepository) {
    this.linksRepository = linksRepository;
  }

  /**
   * Creates a new link document using the provided link DTO.
   *
   * @param {Partial<ILink>} linkDto - Data for creating a new link document.
   * @returns {Promise<LinkDTO>} The created link document as a DTO.
   * @throws {Error} If the creation fails for any reason.
   */
  async create(linkDto: Partial<ILink>): Promise<LinkDTO> {
    try {
      // Call the create method of the links repository, passing in the link DTO
      const newLink = await this.linksRepository.create(linkDto);
      // If the new link document is null or undefined, throw an error
      if (!newLink) throw new LinkException("Sorry unable to create link", HttpCodes.INTERNAL_SERVER_ERROR, " ", `LinksService.class: create.method()`);
      // Otherwise, return the new link document as a LinkDTO
      return ilinkToLinkDTOMapper(newLink);
    } catch (error: any) {
      // If any error occurs during the creation process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else if (error.name === "MongoError" && error.code === 11000) {
        // Error code 11000 indicates that a unique index constraint has been violated.
        // In this case, we want to throw a more specific error message to indicate that the link already exists.
        throw new LinkException("Link already exists.", HttpCodes.CONFLICT, `${error?.stack}`, `LinksService.class: create.method()`);
      } else {
        throw new LinkException(
          `Failed to create new link document: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${error?.stack}`,
          `LinksService.class: create.method()`
        );
      }
    }
  }

  /**
   * Retrieves an array of link DTOs that belong to the specified parent ID.
   *
   * @param {string} parentId - ID of the parent document to filter by.
   * @returns {Promise<LinkDTO[]>} Array of link documents with the given parentId as DTOs.
   * @throws {Error} If the retrieval fails for any reason.
   */
  async getLinksByParentId(parentId: string): Promise<LinkDTO[]> {
    try {
      // Initialize an empty array to hold the resulting link DTOs
      let linkDTOs: LinkDTO[] = [];
      // Call the getAllByParentId method of the links repository, passing in the parent ID as an ObjectID
      const links: ILink[] = await this.linksRepository.getAllByParentId(
        new mongoose.Types.ObjectId(parentId)
      );
      // Map each link document to a LinkDTO and add it to the result array
      links.map((ilink) => {
        linkDTOs.push(ilinkToLinkDTOMapper(ilink));
      });
      // Return the resulting array of LinkDTOs
      return linkDTOs;
    } catch (error: any) {
      // If any error occurs during the creation process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${error?.reason}`,
          `LinksService.class: getLinksByParentId.method()`
        );
      }
    }
  }

  /**
   * Deletes the link with the specified ID.
   *
   * @param {string} id - The ID of the link to delete.
   * @returns {Promise<void>} Resolves if the deletion was successful.
   * @throws Error if the deletion failed.
   */
  async deleteById(id: string): Promise<void> {
    try {
      // Convert the string ID to a MongoDB ObjectID
      const objectId = new mongoose.Types.ObjectId(id);
      // Call the repository's deleteById method with the ObjectID
      await this.linksRepository.deleteById(objectId);
    } catch (error: any) {
      // If an error occurs, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.BAD_REQUEST,
          `${error?.reason}`,
          `LinksService.class: deleteById.method()`
        );
      }
    }
  }

  /**
   * Updates the link with the specified ID using the provided update DTO.
   *
   * @param {string} id - ID of the link document to update.
   * @param {Partial<ILink>} update - Data for updating the link document.
   * @returns {Promise<LinkDTO>} The updated link document as a DTO.
   * @throws {Error} If the update fails for any reason.
   */
  async updateById(id: string, update: Partial<ILink>): Promise<LinkDTO> {
    try {
      // Convert the ID parameter to an ObjectID
      const objectId = new mongoose.Types.ObjectId(id);
      // Call the findByIdAndUpdate method of the links repository to update the link document
      const updatedLink: ILink | null = await this.linksRepository.updateById(
        objectId,
        update
      );
      // If no link document was found with the specified ID, throw an error
      if (!updatedLink) throw new LinkException(`Link with ID ${id} not found.`, HttpCodes.BAD_REQUEST, " ", `LinksService.class: updateById.method()`);
      // Convert the updated link document to a LinkDTO and return it
      return ilinkToLinkDTOMapper(updatedLink);
    } catch (error: any) {
      // If any error occurs during the update process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${error?.reason}`,
          `LinksService.class: updateById.method()`
        );
      }
    }
  }

  /**
   * Deletes all link documents that belong to the specified parent ID.
   *
   * @param {string} parentId - ID of the parent document to delete links for.
   * @returns {Promise<void>} Resolves if the deletion succeeded.
   * @throws Error if the deletion failed.
   */
  async deleteManyByParentId(parentId: string): Promise<void> {
    try {
      // Convert the parentId string to a Mongoose ObjectId to match the document schema.
      const objectId = new mongoose.Types.ObjectId(parentId);

      // Call the deleteManyByParentId method on the linksRepository to delete all links with the given parentId.
      await this.linksRepository.deleteManyByParentId(objectId);
    } catch (error: any) {
      // If any error occurs during the update process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${error?.reason}`,
          `LinksService.class: deleteManyByParentId.method()`
        );
      }

    }
  }
}

export default LinksService;
