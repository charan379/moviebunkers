import SeasonDTO, { iSeasonToSeasonDTOMapper } from "@dto/season.dto";
import ISeasonService from "./interfaces/season.service.interface";
import { Inject, Service } from "typedi";
import SeasonRepository from "@repositories/season.repository";
import { ISeason } from "@models/interfaces/season.interface";
import SeasonException from "@exceptions/season.exception";
import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import { Types } from "mongoose";

/**
 * The `SeasonService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting seasons.
 * 
 * @class SeasonService
 * @implements ISeasonService
 */
@Service()
class SeasonService implements ISeasonService {

    private seasonRepository: SeasonRepository;

    /**
     * Creates an instance of SeasonService.
     * @param {SeasonRepository} seasonRepository - Instance of SeasonRepository injected by typedi.
     */
    constructor(@Inject() seasonRepository: SeasonRepository) {
        this.seasonRepository = seasonRepository;
    }


    /**
     * Creates a new season with the given data.
     *
     * @async
     * @param {Partial<ISeason>} season - The partial season object to create.
     * @returns {Promise<SeasonDTO>} A Promise that resolves to the created season DTO.
     * @throws {SeasonException} If there is an error creating the season.
     */
    async create(season: Partial<ISeason>): Promise<SeasonDTO> {
        try {
            // Call the create method of the season repository and pass in the partial season object
            const newSeason: ISeason | null = await this.seasonRepository.create(season);

            // If the returned season is null, throw a SeasonException with the appropriate error message and details
            if (!newSeason) {
                throw new SeasonException(
                    `Season creation failed`,
                    HttpCodes.CONFLICT,
                    `Received null from creating new season`,
                    `@SeasonService.class: @create.method(), season: ${JSON.stringify(season)}`
                )
            } else {
                // Otherwise, map the returned season to a SeasonDTO and return it
                return iSeasonToSeasonDTOMapper(newSeason);
            }

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a SeasonException and rethrow it
                throw new SeasonException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@SeasonService.class: @create.method()`
                );
            }
        }
    }


    /**
     * Retrieves all seasons belonging to a TV show with the specified ID.
     *
     * @async
     * @param {string} tvShowId - The ID of the TV show to retrieve seasons for.
     * @returns {Promise<SeasonDTO[]>} A Promise that resolves to an array of SeasonDTO objects.
     * @throws {SeasonException} If there is an error retrieving the seasons.
     */
    async getSeasonsByTvShowId(tvShowId: string): Promise<SeasonDTO[]> {
        try {
            // Declare a variable to store the resulting SeasonDTO array
            let seasonDTOs: SeasonDTO[];

            // Call the findByTvShowId method of the season repository and pass in the TV show ID as an ObjectId
            const iseasons: ISeason[] = await this.seasonRepository.findByTvShowId(new Types.ObjectId(tvShowId));

            // Map each ISeason object to a SeasonDTO object and store the resulting array in seasonDTOs
            seasonDTOs = iseasons.map(iseason => iSeasonToSeasonDTOMapper(iseason));

            // Return the seasonDTOs array
            return seasonDTOs;
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a SeasonException and rethrow it
                throw new SeasonException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@SeasonService.class: @getSeasonsByTvShowId.method()`
                );
            }
        }
    }


    /**
     * Updates the season with the specified ID with the provided update object.
     *
     * @async
     * @param {string} id - The ID of the season to update.
     * @param {Partial<ISeason>} update - An object containing the properties to update and their new values.
     * @returns {Promise<SeasonDTO>} A Promise that resolves to the updated SeasonDTO object.
     * @throws {SeasonException} If there is an error updating the season.
     */
    async updateSeasonById(id: string, update: Partial<ISeason>): Promise<SeasonDTO> {
        try {
            // Call the updateById method of the season repository, passing in the ID as an ObjectId and the update object
            const updatedSeason: ISeason | null = await this.seasonRepository.updateById(new Types.ObjectId(id), update);

            if (!updatedSeason) {
                // If the updated season is null, throw a SeasonException
                throw new SeasonException(
                    `Season updation failed`,
                    HttpCodes.CONFLICT,
                    `Received null from updating season`,
                    `@SeasonService.class: @updateSeasonById.method(), season-update: ${JSON.stringify(update)}`
                );
            } else {
                // Otherwise, map the returned season to a SeasonDTO and return it
                return iSeasonToSeasonDTOMapper(updatedSeason);
            }
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a SeasonException and rethrow it
                throw new SeasonException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@SeasonService.class: @updateSeasonById.method()`
                );
            }
        }
    }


    /**
     * Deletes a season from the database using its id.
     * @param {string} id - The id of the season to delete.
     * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
     * @throws {SeasonException} If there is an error deleting the season.
     */
    async deleteSeasonById(id: string): Promise<void> {
        try {
            // Call the deleteById method of the season repository, passing in the id of the season to delete
            await this.seasonRepository.deleteById(new Types.ObjectId(id));
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a SeasonException and rethrow it
                throw new SeasonException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@SeasonService.class: @deleteSeasonById.method()`
                );
            }
        }
    }


    /**
     * Deletes all seasons associated with a given TV show ID.
     * @param {string} tvShowId - The ID of the TV show whose seasons are to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
     * @throws {SeasonException} - If an error occurs while deleting the seasons.
     */
    async deleteAllSeasonByTVShowId(tvShowId: string): Promise<void> {
        try {
            // Call the deleteManyByTvShowId method of the season repository to delete all seasons for the given TV show ID
            await this.seasonRepository.deleteManyByTvShowId(new Types.ObjectId(tvShowId));
        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a SeasonException and rethrow it
                throw new SeasonException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@SeasonService.class: @deleteAllSeasonByTVShowId.method()`
                );
            }
        }
    }

}

export default SeasonService