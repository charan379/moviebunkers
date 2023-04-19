import EpisodeDTO, { iEpisodeToEpisodeDTOMapper } from "@dto/episode.dto";
import { IEpisode } from "@models/interfaces/episode.interface";
import IEpisodeService from "./interfaces/episode.service.interface";
import EpisodeRepository from "@repositories/episode.repository";
import { Inject, Service } from "typedi";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import EpisodeException from "@exceptions/episode.exception";
import HttpCodes from "@constants/http.codes.enum";
import { Types } from "mongoose";

/**
 * The `EpisodeService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting seasons.
 * 
 * @class EpisodeService
 * @implements IEpisodeService
 */
@Service()
class EpisodeService implements IEpisodeService {

    private episodeRepository: EpisodeRepository;

    /**
     * Creates an instance of EpisodeService.
     * @param {EpisodeRepository} episodeRepository - Instance of EpisodeRepository injected by typedi.
     */
    constructor(@Inject() episodeRepository: EpisodeRepository) {
        this.episodeRepository = episodeRepository;
    }


    /**
     * Creates a new episode.
     *
     * @async
     * @param {Partial<IEpisode>} episode - The partial episode object to create.
     * @returns {Promise<EpisodeDTO>} A promise that resolves to the newly created episode object in DTO format.
     * @throws {EpisodeException} If the episode creation fails or an error occurs while creating the episode.
     */
    async create(episode: Partial<IEpisode>): Promise<EpisodeDTO> {
        try {
            // Call the `create` method of the `episodeRepository` class to create a new episode
            const newEpisode: IEpisode | null = await this.episodeRepository.create(episode);

            if (!newEpisode) {
                // If the episode creation fails, throw an EpisodeException with the appropriate error message, HTTP status code, and error details
                throw new EpisodeException(
                    `Episode creation failed`,
                    HttpCodes.CONFLICT,
                    `Received null from creating new episode`,
                    `@EpisodeService.class: @create.method()`
                )
            } else {
                // If the episode is created successfully, map the IEpisode object to an EpisodeDTO object using the `iEpisodeToEpisodeDTOMapper` function and return the result
                return iEpisodeToEpisodeDTOMapper(newEpisode)
            }

        } catch (error: any) {
            // If an error occurs during the execution of the `create` method, catch the error and handle it appropriately
            if (error instanceof MoviebunkersException) {
                // If the error is already an instance of the `MoviebunkersException` class, simply rethrow it
                throw error;
            } else {
                // Otherwise, wrap the error in a new instance of the `EpisodeException` class with the appropriate error message, HTTP status code, and error details, and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @create.method()`
                );
            }
        }
    }


    /**
     * Retrieves all episodes for a given TV show and season.
     *
     * @async
     * @param {string} tvShowId - The ID of the TV show to retrieve episodes for.
     * @param {string} seasonId - The ID of the season to retrieve episodes for.
     * @returns {Promise<EpisodeDTO[]>} A promise that resolves to an array of EpisodeDTO objects.
     * @throws {EpisodeException} If an error occurs while retrieving the episodes.
     */
    async getEpisodesByTvSeasonId(tvShowId: string, seasonId: string): Promise<EpisodeDTO[]> {
        try {
            // Declare an empty array to hold the resulting EpisodeDTO objects
            let episodeDTOs: EpisodeDTO[];

            // Call the `findByTvSeasonId` method of the `episodeRepository` object to retrieve the IEpisode objects
            const iepisodes: IEpisode[] = await this.episodeRepository.findByTvSeasonId(new Types.ObjectId(tvShowId), new Types.ObjectId(seasonId));

            // Map the IEpisode objects to EpisodeDTO objects using the `iEpisodeToEpisodeDTOMapper` function
            episodeDTOs = iepisodes.map(iepisode => iEpisodeToEpisodeDTOMapper(iepisode));

            // Return the resulting EpisodeDTO array
            return episodeDTOs

        } catch (error: any) {
            // If an error occurs during the execution of the `findByTvSeasonId` method, catch the error and handle it appropriately

            if (error instanceof MoviebunkersException) {
                // If the error is already an instance of the `MoviebunkersException` class, simply rethrow it
                throw error;
            } else {
                // Otherwise, wrap the error in a new instance of the `EpisodeException` class with the appropriate error message, HTTP status code, and error details, and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @getEpisodesByTvSeasonId.method()`
                );
            }
        }
    }

    /**
     * GET an episode by its ID
     * @param {string} id - The ID of the episode to be fetched
     * @returns {Promise<EpisodeDTO>} - The fetched episode as an EpisodeDTO object
     * @throws {EpisodeException} - If there is an error while fetching the episode
     */
    async getEpisodeById(id: string): Promise<EpisodeDTO> {
        try {
            // Get episode with the given ID using the episode repository's findById method
            const episode: IEpisode | null = await this.episodeRepository.findById(new Types.ObjectId(id));

            if (!episode) {
                // If the episode with id not found, throw an EpisodeException with the appropriate error message, HTTP status code, and error details
                throw new EpisodeException(
                    `Episode Not Found`,
                    HttpCodes.CONFLICT,
                    `No Episodes available with id: ${id}`,
                    `@EpisodeService.class: @getEpisodeById.method()`
                )
            } else {
                // If the episode is fetched successfully, map the IEpisode object to an EpisodeDTO object using the `iEpisodeToEpisodeDTOMapper` function and return the result
                return iEpisodeToEpisodeDTOMapper(episode)
            }
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @getEpisodeById.method()`
                );
            }
        }
    }


    /**
     * Updates an episode by its ID
     * @param {string} id - The ID of the episode to be updated
     * @param {Partial<IEpisode>} update - The updates to be applied to the episode
     * @returns {Promise<EpisodeDTO>} - The updated episode as an EpisodeDTO object
     * @throws {EpisodeException} - If there is an error updating the episode
     */
    async updatedById(id: string, update: Partial<IEpisode>): Promise<EpisodeDTO> {
        try {
            // Update the episode with the given ID using the episode repository's updateById method
            const updatedEpisode: IEpisode | null = await this.episodeRepository.updateById(new Types.ObjectId(id), update);

            if (!updatedEpisode) {
                // If the episode updation fails, throw an EpisodeException with the appropriate error message, HTTP status code, and error details
                throw new EpisodeException(
                    `Episode updation failed`,
                    HttpCodes.CONFLICT,
                    `Received null from updating new episode`,
                    `@EpisodeService.class: @updatedById.method()`
                )
            } else {
                // If the episode is updated successfully, map the IEpisode object to an EpisodeDTO object using the `iEpisodeToEpisodeDTOMapper` function and return the result
                return iEpisodeToEpisodeDTOMapper(updatedEpisode)
            }
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @updatedById.method()`
                );
            }
        }
    }


    /**
     * Deletes an episode with the given ID
     * @param {string} id - The ID of the episode to delete
     * @returns {Promise<void>}
     * @throws {EpisodeException} If there is an error deleting the episode
     */
    async deleteById(id: string): Promise<void> {
        try {
            // Call the deleteById method of the episode repository, passing in the ID as a Types.ObjectId
            await this.episodeRepository.deleteById(new Types.ObjectId(id));
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in an EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @deleteById.method()`
                );
            }
        }
    }



    /**
     * Delete many episodes of a TV show season using the IDs of the TV show and the season.
     * @param tvShowId - The ID of the TV show to delete episodes from.
     * @param seasonId - The ID of the season to delete episodes from.
     * @throws {EpisodeException} If the deletion fails, a custom exception is thrown.
     */
    async deleteManyByTvSeasonId(tvShowId: string, seasonId: string): Promise<void> {
        try {
            // Call the episodeRepository's deleteManyByTvSeasonId method with the provided TV show ID and season ID.
            await this.episodeRepository.deleteManyByTvSeasonId(new Types.ObjectId(tvShowId), new Types.ObjectId(seasonId));
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it.
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in an EpisodeException and rethrow it.
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @deleteManyByTvSeasonId.method()`
                );
            }
        }
    }



    /**
     * Deletes all episodes belonging to a TV show with the given ID
     * @param {string} tvShowId - The ID of the TV show whose episodes should be deleted
     * @returns {Promise<void>}
     * @throws {EpisodeException} - If there was an error deleting the episodes
     */
    async deleteManyByTvShowId(tvShowId: string): Promise<void> {
        try {
            // Call the deleteManyByTvShowId method of the episode repository, passing in the TV show ID as a Types.ObjectId
            await this.episodeRepository.deleteManyByTvShowId(new Types.ObjectId(tvShowId));
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in an EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @deleteManyByTvShowId.method()`
                );
            }
        }
    }

}

export default EpisodeService;