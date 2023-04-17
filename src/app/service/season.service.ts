import SeasonDTO from "@dto/season.dto";
import ISeasonService from "./interfaces/season.service.interface";
import { Inject, Service } from "typedi";
import SeasonRepository from "@repositories/season.repository";
import { ISeason } from "@models/interfaces/season.interface";

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


    create(season: Partial<ISeason>): Promise<SeasonDTO> {
        try {
            throw new Error("Method not implemented.");
        } catch (error: any) {
            throw error
        }
    }

    async getSeasonsByTvShowId(tvShowId: string): Promise<SeasonDTO[]> {

        try {
            throw new Error("Method not implemented.");
        } catch (error: any) {
            throw error
        }
    }

    async updateSeasonByid(id: string, update: Partial<ISeason>): Promise<SeasonDTO> {
        try {
            throw new Error("Method not implemented.");
        } catch (error: any) {
            throw error
        }
    }

    async deleteSeasonById(id: string): Promise<void> {
        try {
            throw new Error("Method not implemented.");
        } catch (error: any) {
            throw error
        }
    }

    async deleteAllSeasonByTVShowId(tvShowId: string): Promise<void> {
        try {
            throw new Error("Method not implemented.");
        } catch (error: any) {
            throw error
        }
    }
}

export default SeasonService