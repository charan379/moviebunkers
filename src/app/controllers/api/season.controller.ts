import HttpCodes from "@constants/http.codes.enum";
import SeasonDTO from "@dto/season.dto";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { seasonSchema } from "@joiSchemas/season.joi.schema";
import { ISeason } from "@models/interfaces/season.interface";
import SeasonService from "@service/season.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * Controller for handling seasons related API requests
 * @class SeasonController
 */
@Service()
class SeasonController {
    public router: Router;
    private seasonService: SeasonService;

    /**
     * Constructor of SeasonController class
     * @param seasonService An instance of SeasonService class
     */
    constructor(@Inject() seasonService: SeasonService) {
        this.seasonService = seasonService;
        this.router = Router();

        /**
         * @swagger
         * /seasons/new:
         *  post:
         *   tags:
         *     - Seasons
         *   summary: API to create new season
         *   description: create a season for valid season object
         *   requestBody:
         *      content:
         *        application/json:
         *          schema:
         *              $ref: '#/components/schemas/season'
         *   responses:
         *       201:
         *          description: Success
         *       400:
         *          description: Invalid new season
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/new", this.createSeason.bind(this));

        /**
          * @swagger
          * /seasons/{id}:
          *  get:
          *   tags:
          *     - Seasons
          *   summary: API to fetch season based on its id
          *   description: fetches seasons with its id
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
        this.router.get("/:id", this.getSeasonById.bind(this));

        /**
          * @swagger
          * /seasons/tv/{id}:
          *  get:
          *   tags:
          *     - Seasons
          *   summary: API to fetch seasons based on tvShow id
          *   description: fetches seasons with tvShow id
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
        this.router.get("/tv/:id", this.getSeasonsByTvShowId.bind(this));

        /**
          * @swagger
          * /seasons/update/{id}:
          *  put:
          *   tags:
          *     - Seasons
          *   summary: API to update seasons based on its id
          *   description: updates seasons
          *   requestBody:
          *      content:
          *        application/json:
          *          schema:
          *              $ref: '#/components/schemas/season'
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
        this.router.put("/update/:id", this.updateSeasonById.bind(this));

        /**
          * @swagger
          * /seasons/delete/{id}:
          *  delete:
          *   tags:
          *     - Seasons
          *   summary: API to delete seasons based on its id
          *   description: deleted season
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
        this.router.delete("/delete/:id", this.deleteSeasonById.bind(this));
    }

    /**
     * Controller to handle API requests for creating new season
     *
     * @route POST /seasons/new
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async createSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body against season schema
            const validNewSeason: ISeason = await JoiValidator(seasonSchema, req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            // Call create method of seasonService class to create new season
            const createdSeason: SeasonDTO = await this.seasonService.create(
                validNewSeason
            );

            // Send response with code 201 and createSeason to client
            res.status(HttpCodes.CREATED).json(createdSeason);
        } catch (error) {
            // Pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting season by its id
       * 
       * @route GET /seasons/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getSeasonById method of seasonService class to get seasonDTO
            const seasonDTO: SeasonDTO = await this.seasonService.getSeasonById(validId);

            // respond with status code 200 with a SeasonDTO to client
            res.status(HttpCodes.OK).json(seasonDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting seasons by tvshow id
       * 
       * @route GET /seasons/tv/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getSeasonsByTvShowId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getSeasonsByTvShowId method of seasonService class to get array of seasonDTOs
            const seasonDTOs: SeasonDTO[] = await this.seasonService.getSeasonsByTvShowId(validId);

            // respond with status code 200 with an array of SeasonDTOs to client
            res.status(HttpCodes.OK).json(seasonDTOs);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for updating seasons by its id
       * 
       * @route PUT /seasons/update/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async updateSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // validate update object 
            const update: ISeason = await JoiValidator(seasonSchema, req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            // call updateSeasonById method of seasonService class to update season and get updated season
            const seasonDTO: SeasonDTO = await this.seasonService.updateSeasonById(validId, update);

            // respond with status code 200 with seasonDTO to client
            res.status(HttpCodes.OK).json(seasonDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for deleting a seasons by its id
       * 
       * @route DELETE /seasons/delete/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async deleteSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // call deleteSeasonById method of seasonService class to delete season
            await this.seasonService.deleteSeasonById(validId);

            // respond with status code 200 after deleting
            res.status(HttpCodes.OK).json({ message: 'Successfully Deleted' });
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }
}

export default SeasonController;
