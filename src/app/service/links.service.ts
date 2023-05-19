import LinkDTO, { ilinkToLinkDTOMapper } from "@dto/link.dto";
import ILinksService from "./interfaces/links.service.interface";
import { Inject, Service } from "typedi";
import LinksRepository from "@repositories/links.repository";
import ILink from "@models/interfaces/link.interface";
import mongoose, { Types } from "mongoose";
import LinkException from "@exceptions/link.exception";
import HttpCodes from "@constants/http.codes.enum";
import MongoSortBuilder from "@utils/mongo.sort.builder";
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
   * Creates a new link document using the provided link.
   *
   * @param {Partial<ILink>} link - Data for creating a new link document.
   * @returns {Promise<LinkDTO>} The created link document as a DTO.
   * @throws {LinkException} If the creation fails for any reason.
   */
  async create(link: Partial<ILink>): Promise<LinkDTO> {
    try {
      // Call the create method of the links repository, passing in the link object
      const newLink: ILink | null = await this.linksRepository.create(link);
      // If the new link document is null or undefined, throw an error
      if (!newLink) throw new LinkException(
        "Sorry unable to new create link",
        HttpCodes.CONFLICT,
        `Link Createion Failed Link: ${JSON.stringify(link)}`,
        `LinksService.class: create.method()`);
      // Otherwise, return the new link document as a LinkDTO
      return ilinkToLinkDTOMapper(newLink);
    } catch (error: any) {
      // If any error occurs during the creation process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else if (error.name === "MongoError" && error.code === 11000) {
        // Error code 11000 indicates that a unique index constraint has been violated.
        // In this case, we want to throw a more specific error message to indicate that the link already exists.
        throw new LinkException("Link already exists.",
          HttpCodes.CONFLICT,
          `${error?.stack}`,
          `LinksService.class: create.method()`);
      } else {
        throw new LinkException(
          `Failed to create new link document: ${error?.message}`,
          HttpCodes.CONFLICT,
          `${error?.stack}`,
          `LinksService.class: create.method()`
        );
      }
    }
  }

  /**
   * Retrieves a link its ID.
   *
   * @param {string} id - ID of the document id of link.
   * @returns {Promise<LinkDTO>} The fetched link document as a DTO.
   * @throws {LinkException} If the fetching fails for any reason.
   */
  async getLinkById(id: string): Promise<LinkDTO> {
    try {
      // Call the findById method of the links repository, passing in the Id of link
      const link: ILink | null = await this.linksRepository.findById(new Types.ObjectId(id));

      // If the link document is null or undefined, throw an error
      if (!link) throw new LinkException(
        "Link Not Found",
        HttpCodes.CONFLICT,
        `No Link found with given object _id: ${id}`,
        `LinksService.class: getLinkById.method()`);

      // Otherwise, return the new link document as a LinkDTO
      return ilinkToLinkDTOMapper(link);
    } catch (error: any) {
      // If any error occurs during the fetching process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.CONFLICT,
          `${error?.stack}`,
          `LinksService.class: getLinkById.method()`
        );
      }
    }
  }


  /**
   * Retrieves an array of link DTOs that belong to the specified parent ID.
   *
   * @param {string} parentId - ID of the parent document to filter by.
   * @param {object} options - An optional object containing pagination and sorting options.
   * @param {number} options.limit - The maximum number of links to retrieve (default: 0, meaning no limit).
   * @param {number} options.skip - The number of links to skip (default: 0).
   * @param {object} options.sortBy - An object specifying the field to sort by and the sort order (default: { createdAt: "desc" }).
   * @returns {Promise<LinkDTO[]>} Array of link documents with the given parentId as DTOs.
   * @throws {LinkException} If the retrieval fails for any reason.
   */
  async getLinksByParentId(parentId: string, options: { limit: number, skip: number, sortBy: string } = { limit: 0, skip: 0, sortBy: "createdAt.desc" }): Promise<LinkDTO[]> {
    try {
      // Initialize an empty array to hold the resulting link DTOs
      let linkDTOs: LinkDTO[] = [];
      // Call the getAllByParentId method of the links repository, passing in the parent ID as an ObjectID
      const links: ILink[] = await this.linksRepository.findAllByParentId(
        new mongoose.Types.ObjectId(parentId), {
        limit: options.limit,
        skip: options.skip,
        sortBy: MongoSortBuilder(options.sortBy),
      }
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
          HttpCodes.CONFLICT,
          `${error?.reason}`,
          `LinksService.class: getLinksByParentId.method()`
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
   * @throws {{LinkException}} If the update fails for any reason.
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
      if (!updatedLink) throw new LinkException(
        `Failed to Updated Link`,
        HttpCodes.BAD_REQUEST,
        `Link with ID ${id} not found.`,
        `LinksService.class: updateById.method()`);
      // Convert the updated link document to a LinkDTO and return it
      return ilinkToLinkDTOMapper(updatedLink);
    } catch (error: any) {
      // If any error occurs during the update process, re-throw it to be handled by the caller
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new LinkException(
          `${error?.message}`,
          HttpCodes.CONFLICT,
          `${error?.reason}`,
          `LinksService.class: updateById.method()`
        );
      }
    }
  }


  /**
   * Deletes the link with the specified ID.
   *
   * @param {string} id - The ID of the link to delete.
   * @returns {Promise<void>} Resolves if the deletion was successful.
   * @throws {LinkException} Error if the deletion failed.
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
          HttpCodes.CONFLICT,
          `${error?.reason}`,
          `LinksService.class: deleteById.method()`
        );
      }
    }
  }


  /**
   * Deletes all link documents that belong to the specified parent ID.
   *
   * @param {string} parentId - ID of the parent document to delete links for.
   * @returns {Promise<void>} Resolves if the deletion succeeded.
   * @throws {LinkException} Error if the deletion failed.
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
          HttpCodes.CONFLICT,
          `${error?.reason}`,
          `LinksService.class: deleteManyByParentId.method()`
        );
      }

    }
  }
}

export default LinksService;
