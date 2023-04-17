import EpisodeDTO from "@dto/episode.dto";
import { IEpisode } from "@models/interfaces/episode.interface";
import IEpisodeService from "./interfaces/episode.service.interface";
import EpisodeRepository from "@repositories/episode.repository";
import { Inject } from "typedi";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import EpisodeException from "@exceptions/episode.exception";
import HttpCodes from "@constants/http.codes.enum";

/**
 * The `EpisodeService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting seasons.
 * 
 * @class EpisodeService
 * @implements IEpisodeService
 */
class EpisodeService implements IEpisodeService {

    private episodeRepository: EpisodeRepository;

    /**
     * Creates an instance of EpisodeService.
     * @param {EpisodeRepository} episodeRepository - Instance of EpisodeRepository injected by typedi.
     */
    constructor(@Inject() episodeRepository: EpisodeRepository) {
        this.episodeRepository = episodeRepository;
    }


    async create(episode: Partial<IEpisode>): Promise<EpisodeDTO> {
        try {

            throw new Error("Method not implemented.");

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @create.method()`
                );
            }
        }
    }


    async getEpisodesByTvSeasonId(tvShowId: string, seasonId: string): Promise<EpisodeDTO[]> {
        try {

            throw new Error("Method not implemented.");

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @getEpisodesByTvSeasonId.method()`
                );
            }
        }
    }


    async updatedById(id: string, update: Partial<IEpisode>): Promise<EpisodeDTO> {
        try {

            throw new Error("Method not implemented.");

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


    async deleteById(id: string): Promise<void> {
        try {

            throw new Error("Method not implemented.");

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @deleteById.method()`
                );
            }
        }
    }


    async deleteManyByTvSeasonId(tvShowId: string, seasonId: string): Promise<void> {
        try {

            throw new Error("Method not implemented.");

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
                throw new EpisodeException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error)}`,
                    `@EpisodeService.class: @deleteManyByTvSeasonId.method()`
                );
            }
        }
    }


    async deleteManyByTvShowId(tvShowId: string): Promise<void> {
        try {

            throw new Error("Method not implemented.");

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a EpisodeException and rethrow it
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