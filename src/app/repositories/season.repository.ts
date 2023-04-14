import { ISeason } from "@models/interfaces/season.interface";
import { Model, Types } from "mongoose";
import ISeasonRepository from "./interfaces/season.repository.interface";
import SeasonModel from "@models/season.model";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";

/**
 * A repository class for managing season data in the database
 * @class
 * @implements ISeasonRepository
 */
class SeasonRepository implements ISeasonRepository {

    private seasonModel: Model<ISeason>;

    /**
     * create a instance of SeasonRepository
     * 
     * @constructor
     */
    constructor() {
        this.seasonModel = SeasonModel;
    }


    /**
     * Finds all seasons associated with a given TV show ID.
     * 
     * @async
     * 
     * @method
     * 
     * @param {Types.ObjectId} tvShowId - The ID of the TV show.
     * @returns {Promise<ISeason[]>} - A promise that resolves to an array of all seasons associated with the TV show ID.
     * @throws {RepositoryException} - If an error occurs while retrieving the seasons.
     */
    async findByTvShowId(tvShowId: Types.ObjectId): Promise<ISeason[]> {
        try {
            // Find all seasons associated with the given TV show ID, excluding the "__v" field
            const season: ISeason[] = await this.seasonModel.find({ tv_show_id: tvShowId }, { __v: 0 }).lean().exec();
            // Return the found seasons
            return season;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `SeasonRepository.class: findByTvShowId.method()`
                );
            }
        }
    }


    /**
     * Updates a season by ID.
     * 
     * @async
     * 
     * @method
     * 
     * @param {Types.ObjectId} id - The ID of the season to update.
     * @param {Partial<ISeason>} update - The properties to update on the season.
     * @returns {Promise<ISeason | null>} - A promise that resolves to the updated season, or null if the season was not found.
     * @throws {RepositoryException} - If an error occurs while retrieving the seasons.
     */
    async updateById(id: Types.ObjectId, update: Partial<ISeason>): Promise<ISeason | null> {
        try {
            // Find and update the season by ID, returning the updated document and running validators
            const updatedSeason = await this.seasonModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean().exec();
            // Return the updated season
            return updatedSeason;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `SeasonRepository.class: updateById.method()`
                );
            }
        }
    }



    /**
     * Deletes a season by its ID.
     * 
     * @async
     * 
     * @method
     * 
     * @param {Types.ObjectId} id - The ID of the season to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the season has been successfully deleted.
     * @throws {RepositoryException} - If an error occurs while deleting the season.
     */
    async deleteById(id: Types.ObjectId): Promise<void> {
        try {
            // Find and delete the season with the given ID
            await this.seasonModel.findByIdAndDelete(id).exec();
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `SeasonRepository.class: deleteById.method()`
                );
            }
        }
    }

    /**
     * Deletes all seasons associated with a given TV show ID.
     * 
     * @async
     * 
     * @method
     * 
     * @param {Types.ObjectId} tvShowId - The ID of the TV show.
     * @returns {Promise<void>} - A promise that resolves when all seasons associated with the TV show ID have been deleted.
     * @throws {RepositoryException} - If an error occurs while deleting the seasons.
     */
    async deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void> {
        try {
            // Delete all seasons associated with the given TV show ID
            await this.seasonModel.deleteMany({ tvShow: tvShowId }).exec();
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `SeasonRepository.class: deleteManyByTvShowId.method()`
                );
            }
        }
    }





}


export default SeasonRepository;