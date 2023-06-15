import HttpCodes from "@constants/http.codes.enum";
import { LevelOne, LevelThere, LevelTwo, LevelZero } from "@constants/user.roles.enum";
import EpisodeDTO from "@dto/episode.dto";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { sortSkipLimitSchema } from "@joiSchemas/common.title.joi.schemas";
import { episodeSchema } from "@joiSchemas/episode.joi.schema";
import Authorize from "@middlewares/authorization.middleware";
import { IEpisode } from "@models/interfaces/episode.interface";
import EpisodeService from "@service/episode.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { Inject, Service } from "typedi";

/**
 * Controller for handling episodes related API requests
 * @class EpisodeController
 */
@Service()
class EpisodeController {
    public router: Router;
    private episodeService: EpisodeService;

    /**
     * Constructor of EpisodeController class
     * @param episodeService An instance of EpisodeService class
     */
    constructor(@Inject() episodeService: EpisodeService) {
        this.episodeService = episodeService;
        this.router = Router();

        /**
         * @swagger
         * /episodes/new:
         *  post:
         *   tags:
         *     - Episodes
         *   summary: API to create new episode
         *   description: create a episode for valid episode object
         *   requestBody:
         *      content:
         *        application/json:
         *          schema:
         *              $ref: '#/components/schemas/episode'
         *   responses:
         *       201:
         *          description: Success
         *       400:
         *          description: Invalid new episode
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/new", Authorize(LevelTwo), this.createEpisode.bind(this));

        /**
          * @swagger
          * /episodes/{id}:
          *  get:
          *   tags:
          *     - Episodes
          *   summary: API to fetch episode based on its id
          *   description: fetches episodes with its id
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.get("/:id", Authorize(LevelZero), this.getEpisodeById.bind(this));

        /**
          * @swagger
          * /episodes/tv/{tvShowId}/season/{seasonNumber}:
          *  get:
          *   tags:
          *     - Episodes
          *   summary: API to fetch episodes based on tvShowId and seasonNumber
          *   description: fetches episodes with tvShowId and seasonNumber
          *   parameters:
          *     - in: path
          *       name: tvShowId
          *       schema:
          *          type: string
          *     - in: path
          *       name: seasonNumber
          *       schema:
          *          type: integer
          *          example: 1
          *          minimum: 1
          *     - in: query
          *       name: limit
          *       schema:
          *          type: integer
          *     - in: query
          *       name: skip
          *       schema:
          *          type: integer
          *          example: 3
          *          default: 0
          *          minimum: 0
          *     - in: query
          *       name: sort_by
          *       schema:
          *          type: string
          *          example: air_date.desc
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.get("/tv/:tvShowId/season/:seasonNumber", Authorize(LevelZero), this.getEpisodesByTvShowIdAndSeasonNumber.bind(this));

        /**
          * @swagger
          * /episodes/update/{id}:
          *  put:
          *   tags:
          *     - Episodes
          *   summary: API to update episodes based on its id
          *   description: updates episodes
          *   requestBody:
          *      content:
          *        application/json:
          *          schema:
          *              $ref: '#/components/schemas/episode'
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id / update
          *       401:
          *          description: Unauthorized
          */
        this.router.put("/update/:id", Authorize(LevelTwo), this.updateEpisodeById.bind(this));

        /**
          * @swagger
          * /episodes/delete/{id}:
          *  delete:
          *   tags:
          *     - Episodes
          *   summary: API to delete episodes based on its id
          *   description: deleted episode
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.delete("/delete/:id", Authorize(LevelThere), this.deleteEpisodeById.bind(this));

        /**
          * @swagger
          * /episodes/delete-by-tv/{tvShowId}:
          *  delete:
          *   tags:
          *     - Episodes
          *   summary: API to delete episodes based on tv show id id
          *   description: deleted episode
          *   parameters:
          *     - in: path
          *       name: tvShowId
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.delete("/delete-by-tv/:tvShowId", Authorize(LevelThere), this.deleteEpisodesByTvShowId.bind(this));
    }

    /**
     * Controller to handle API requests for creating new episode
     *
     * @route POST /episodes/new
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async createEpisode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body against episode schema
            const validNewEpisode: IEpisode = await JoiValidator(episodeSchema, req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            // Call create method of episodeService class to create new episode
            const createdEpisode: EpisodeDTO = await this.episodeService.create(
                validNewEpisode
            );

            // Send response with code 201 and createdEpisode to client
            res.status(HttpCodes.CREATED).json(createdEpisode);
        } catch (error) {
            // Pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting episode by its id
       * 
       * @route GET /episodes/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getEpisodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate episodeId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getEpisodeById method of  episodeService class to get episodeDTO
            const episodeDTO: EpisodeDTO = await this.episodeService.getEpisodeById(validId);

            // respond with status code 200 with a EpisodeDTO to client
            res.status(HttpCodes.OK).json(episodeDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }


    /**
       * Controller to handle API requests for getting episodes by tvshow id and season id
       * @deprecated
       * @route GET /episodes/tv/:tvShowId/season/:seasonId
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getEpisodesByTvSeasonId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate tvShowId
            const tvShowId = await JoiValidator(ObjectIdSchema, req?.params?.tvShowId, {
                abortEarly: false,
                stripUnknown: true
            });

            // Validate tvShowId
            const seasonId = await JoiValidator(ObjectIdSchema, req?.params?.seasonId, {
                abortEarly: false,
                stripUnknown: true
            })

            //  validate skip, sort, limit options in query
            const validSkipSortLimitQuery = await JoiValidator(sortSkipLimitSchema, req?.query, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getEpisodesByTvSeasonId method of seasonService class to get array of episodeDTOs
            const episodeDTOs: EpisodeDTO[] = await this.episodeService.getEpisodesByTvSeasonId(tvShowId, seasonId, {
                limit: validSkipSortLimitQuery?.limit ?? 0,
                skip: validSkipSortLimitQuery?.skip ?? 0,
                sortBy: validSkipSortLimitQuery?.sort_by ?? "createdAt.desc",
            });

            // respond with status code 200 with an array of SeasonDTOs to client
            res.status(HttpCodes.OK).json(episodeDTOs);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting episodes by tvshow id and seasonNumber
       * 
       * @route GET /episodes/tv/:tvShowId/season/:seasonNumber
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getEpisodesByTvShowIdAndSeasonNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate tvShowId
            const tvShowId = await JoiValidator(ObjectIdSchema, req?.params?.tvShowId, {
                abortEarly: false,
                stripUnknown: true
            });

            // Validate tvShowId
            const seasonNumber = await JoiValidator(Joi.number().required(), req?.params?.seasonNumber, {
                abortEarly: false,
                stripUnknown: true
            })

            //  validate skip, sort, limit options in query
            const validSkipSortLimitQuery = await JoiValidator(sortSkipLimitSchema, req?.query, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getEpisodesByTvSeasonId method of seasonService class to get array of episodeDTOs
            const episodeDTOs: EpisodeDTO[] = await this.episodeService.getEpisodesByTvShowIdAndSeasonNumber(tvShowId, seasonNumber, {
                limit: validSkipSortLimitQuery?.limit ?? 0,
                skip: validSkipSortLimitQuery?.skip ?? 0,
                sortBy: validSkipSortLimitQuery?.sort_by ?? "createdAt.desc",
            });

            // respond with status code 200 with an array of SeasonDTOs to client
            res.status(HttpCodes.OK).json(episodeDTOs);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }


    /**
       * Controller to handle API requests for updating episodes by its id
       * 
       * @route PUT /episodes/update/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async updateEpisodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate episodeId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // validate update object 
            const update: IEpisode = await JoiValidator(episodeSchema, req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            // call updateSeasonById method of seasonService class to update episode and get updated episode
            const episodeDTO: EpisodeDTO = await this.episodeService.updatedById(validId, update);

            // respond with status code 200 with episodeDTO to client
            res.status(HttpCodes.OK).json(episodeDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for deleting a episodes by its id
       * 
       * @route DELETE /episodes/delete/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async deleteEpisodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate episodeId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // call deleteById method of episodeService class to delete episode
            await this.episodeService.deleteById(validId);

            // respond with status code 200 after deleting
            res.status(HttpCodes.OK).json({ message: 'Successfully Deleted' });
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
   * Controller to handle API requests for deleting all episodes by tv show id
   * 
   * @route DELETE /episodes/delete-many/:tvShowId
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
    private async deleteEpisodesByTvShowId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate tvshow id
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.tvShowId, {
                abortEarly: false,
                stripUnknown: true
            });

            // call deleteManyByTvShowId method of episodeService class to delete all episodes
            await this.episodeService.deleteManyByTvShowId(validId);

            // respond with status code 200 after deleting
            res.status(HttpCodes.OK).json({ message: 'Successfully Deleted' });
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }
}

export default EpisodeController;
