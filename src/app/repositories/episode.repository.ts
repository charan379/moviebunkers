import { IEpisode } from "@models/interfaces/episode.interface";
import { Model, Types } from "mongoose";
import IEpisodeRepository from "./interfaces/episode.repository.interface";
import { Service } from "typedi";
import EpisodeModel from "@models/episode.model";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";

/**
 * A repository class for managing episode data in the database
 * @class
 * @implements IEpisodeRepository
 */
@Service()
class EpisodeRepository implements IEpisodeRepository {

    private episodeModel: Model<IEpisode>;

    /**
     * create a instance of EpisodeRepository
     * 
     * @constructor
     */
    constructor() {
        this.episodeModel = EpisodeModel;
    }

    /**
     * Create new episode document.
     * 
     * @async
     * 
     * @method
     * 
     * @param {Partial<IEpisode>} episode - New episode to be created for TV shows season.
     * @returns {Promise<IEpisode | null>} - A promise that resolves to an newly created episode or null .
     * @throws {RepositoryException} - If an error occurs while creating new episode.
     */
    async create(episode: Partial<IEpisode>): Promise<IEpisode | null> {
        try {
            // Use Mongoose's create method to create the new document with the given properties
            const newEpisode: IEpisode = await this.episodeModel.create<Partial<IEpisode>>(episode);
            // Return the created document
            return newEpisode;
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
                    `EpisodeRepository.class: create.method()`
                );
            }
        }
    }

    /**
     * Finds all episodes that match the given tvShowId and seasonId.
     * 
     * @param {Types.ObjectId} tvShowId - The id of the TV show to filter by.
     * @param {Types.ObjectId} seasonId - The id of the season to filter by.
     * @returns {Promise<IEpisode[]>} - A promise that resolves with an array of episodes that match the given filters.
     * @throws {RepositoryException} - If an error occurs while retrieving the episodes.
     */
    async findByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<IEpisode[]> {
        try {
            // Find all episodes that match the given tvShowId and seasonId
            const episodes = await this.episodeModel.find({
                tv_show_id: tvShowId,
                season_id: seasonId,
            }).lean().exec();
            // Return the episodes found
            return episodes

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
                    `EpisodeRepository.class: findByTvSeasonId.method()`
                );
            }
        }
    }


    /**
      * Update an episode document by the given tv show and season ids with the given update object
      * 
      * @param {Types.ObjectId} tvShowId - The id of the tv show associated with the episode to update
      * @param {Types.ObjectId} seasonId - The id of the season associated with the episode to update
      * @param {Partial<IEpisode>} update - The partial update object containing the fields to update
      * @returns {Promise<IEpisode|null>} - The updated episode document, or null if no document was found
      * @throws {RepositoryException} - If an unexpected error occurs during the update operation
      */
    async updateById(tvShowId: Types.ObjectId, seasonId: Types.ObjectId, update: Partial<IEpisode>): Promise<IEpisode | null> {
        try {
            // Find the episode document to update and apply the given update object
            const episode = await this.episodeModel.findOneAndUpdate(
                {
                    tv_show_id: tvShowId,
                    season_id: seasonId
                },
                {
                    $set: update
                },
                {
                    // The new option returns the updated document instead of the original one
                    new: true,
                    // The runValidators option runs mongoose validators on the update operation
                    runValidators: true,
                }
            ).lean().exec()

            // Return the updated episode document, or null if no document was found
            return episode;

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
                    `EpisodeRepository.class: updateById.method()`
                );
            }
        }
    }



    /**
     * Deletes an episode document by its id
     * 
     * @param {Types.ObjectId} id - The id of the episode document to delete
     * @throws {RepositoryException} If an error occurs while deleting the episode document
     * @returns {Promise<void>} A promise that resolves when the episode document has been deleted
     */
    async deleteById(id: Types.ObjectId): Promise<void> {
        try {
            // Find the episode document by its _id and delete it
            await this.episodeModel.findByIdAndDelete(id).exec();
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
                    `EpisodeRepository.class: deleteById.method()`
                );
            }
        }
    }



    /**
     * Deletes all episodes associated with a given TV show and season.
     * 
     * @param {Types.ObjectId} tvShowId - The ID of the TV show to delete episodes for.
     * @param {Types.ObjectId} seasonId - The ID of the season to delete episodes for.
     * @returns {Promise<void>}
     */
    async deleteManyByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<void> {
        try {
            // Delete all episodes associated with the given TV show and season
            await this.episodeModel.deleteMany({
                tv_show_id: tvShowId,
                season_id: seasonId
            }).exec();
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
                    `EpisodeRepository.class: deleteManyByTvSeasonId.method()`
                );
            }
        }
    }

    /**
     * Delete all episodes associated with a given TV show.
     * 
     * @param {Types.ObjectId} tvShowId - The ObjectId of the TV show.
     * @returns {Promise<void>} A Promise that resolves when the deletion is complete.
     * @throws {RepositoryException} Throws an exception if an error occurs while executing the delete operation.
     */
    async deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void> {
        try {
            // Delete all episodes associated with the given TV show
            await this.episodeModel.deleteMany({
                tv_show_id: tvShowId,
            }).exec();
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
                    `EpisodeRepository.class: deleteManyByTvShowId.method()`
                );
            }
        }
    }

}