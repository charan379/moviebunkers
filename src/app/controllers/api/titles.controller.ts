import HttpCodes from "@constants/http.codes.enum";
import UserRoles, { LevelOne, LevelTwo } from "@constants/user.roles.enum";
import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import baseTitleSchema from "@joiSchemas/base.joi.title.schema";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { getAllTitlesQuerySchema } from "@joiSchemas/common.title.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import TitleService from "@service/title.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * @Controller("/titles") => TitleController.class
 */
@Service()
class TitleController {

    public router: Router;
    private titleService: TitleService;

    constructor(@Inject() titleService: TitleService) {
        this.titleService = titleService;

        this.router = Router();

        //get
        /**
         * @swagger
         * /titles:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to get all titles
         *   description: return list of titles for given query
         *   parameters:
         *      - in: query
         *        name: search
         *        schema:
         *          type: string
         *      - in: query
         *        name: genre
         *        schema:
         *          type: string
         *      - in: query
         *        name: language
         *        schema:
         *          type: string
         *          description: ISO_639_1_code of language
         *          example: en
         *      - in: query
         *        name: movie
         *        schema:
         *          type: integer
         *          minimum: 0
         *          maximum: 1
         *          enum: [0,1]
         *          default: 1
         *          description: 1 for include movies, 0 exclude movies
         *          example: 1
         *      - in: query
         *        name: tv
         *        schema:
         *          type: integer
         *          minimum: 0
         *          maximum: 1
         *          enum: [0,1]
         *          default: 1
         *          description: 1 for include tv shows, 0 exclude tv shows
         *          example: 1
         *      - in: query
         *        name: starred
         *        schema:
         *          type: integer
         *          minimum: 0
         *          maximum: 1
         *          enum: [0,1]
         *          default: 0
         *          description: 1 filters user starred titles, 0 disables this filter
         *          example: 0
         *      - in: query
         *        name: favourite
         *        schema:
         *          type: integer
         *          minimum: 0
         *          maximum: 1
         *          enum: [0,1]
         *          default: 0
         *          description: 1 filters user favourite titles, 0 disables this filter
         *          example: 0
         *      - in: query
         *        name: seen
         *        schema:
         *          type: integer
         *          minimum: -1
         *          maximum: 1
         *          enum: [-1,0,1]
         *          default: 0
         *          description: -1 filters user unseen titles, 1 filters user seen titles, 0 disables this filter
         *          example: 0
         *      - in: query
         *        name: age.gte
         *        schema:
         *          type: integer
         *          minimum: 2
         *          maximum: 26
         *          default: 8
         *          description: age filter lower limit value, must be lower than age.lte 
         *          example: 12
         *      - in: query
         *        name: age.lte
         *        schema:
         *          type: integer
         *          minimum: 2
         *          maximum: 26
         *          default: 8
         *          description: age filter upper limit value, must be higger than age.gte
         *          example: 18
         *      - in: query
         *        name: country
         *        schema:
         *          type: string
         *          enum: ["IN"]
         *          example: IN
         *      - in: query
         *        name: sort_by
         *        schema:
         *          type: string
         *          example: year.desc
         *      - in: query
         *        name: limit
         *        schema:
         *          type: integer
         *      - in: query
         *        name: page
         *        schema:
         *          type: integer
         *      - in: query
         *        name: minimal
         *        schema:
         *          type: boolean
         *   responses:
         *       200:
         *          description: Success
         *       401:
         *          description: Unauthorized
         *       400:
         *          description: Invalid query
         */
        this.router.get("/", Authorize(LevelOne), this.getAllTitles.bind(this));

        /**
         * @swagger
         * /id/{id}:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to get title details base Id
         *   description: return title details based on title ID
         *   parameters:
         *     - in: path
         *       name: id
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       401:
         *          description: Unauthorized
         *       400:
         *          description: Invalid id
         *       404:
         *          description: Not Found
         */
        this.router.get("/id/:id", Authorize(LevelOne), this.getTitleById.bind(this));

        //post
        /**
         * @swagger
         * /titles/new:
         *  post:
         *   tags:
         *     - Titles
         *   summary: API to create new title
         *   description: create a title for valid title object
         *   requestBody:
         *      content:
         *        application/json:
         *          description: movie
         *          schema:
         *              #$ref: '#/components/schemas/new_movie'
         *              #$ref: '#/components/schemas/new_tv'
         *              oneOf:
         *                  - $ref: '#/components/schemas/new_movie'
         *                  - $ref: '#/components/schemas/new_tv'
         *                
         *   responses:
         *       200:
         *          description: Success
         *       400:
         *          description: Invalid new title
         *       401:
         *          description: Unauthorized
         *      
         */
        this.router.post("/new", Authorize(LevelTwo), this.createTitle.bind(this));
    }

    /**
     * @Get("/") => getAllTitles() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async getAllTitles(req: Request, res: Response, next: NextFunction) {

        try {

            const validQuery: FindAllTitlesQueryDTO = await JoiValidator(getAllTitlesQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

            const page: PageDTO = await this.titleService.getAllTitles(validQuery);

            res.status(HttpCodes.OK).json(page);

        } catch (error) {

            next(error)
        }
    }

    /**
     * @Get("/id/:id") => getTitleById() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async getTitleById(req: Request, res: Response, next: NextFunction) {

        try {

            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, { abortEarly: false, allowUnknown: false, stripUnknown: true })

            const titileDTO: TitleDTO = await this.titleService.getTitleById(validId);

            res.status(200).json(titileDTO)

        } catch (error) {

            next(error)
        }
    }

    /**
     * @Post("/new") => createTitle() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async createTitle(req: Request, res: Response, next: NextFunction) {

        try {
            const titleDTO: Partial<TitleDTO> = await JoiValidator(baseTitleSchema, req.body, { abortEarly: false, allowUnknown: true, stripUnknown: false });

            const newTitle: TitleDTO = await this.titleService.createTitle(titleDTO);

            res.status(201).json({ message: "New Title Added Successfully", new_title_id: newTitle._id })

        } catch (error) {

            next(error)
        }
    }
}

export default TitleController;