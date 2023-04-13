import HttpCodes from "@constants/http.codes.enum";
import { LevelOne, LevelThere, LevelTwo, LevelZero } from "@constants/user.roles.enum";
import LanguageDTO from "@dto/language.dto";
import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import TitleException from "@exceptions/title.exeception";
import baseTitleSchema from "@joiSchemas/base.joi.title.schema";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { getAllTitlesQuerySchema } from "@joiSchemas/common.title.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import TitleService from "@service/title.service";
import { UserService } from "@service/user.service";
import UserDataService from "@service/userdata.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongoose";
import { Inject, Service } from "typedi";

/**
 * @Controller("/titles") => TitleController.class
 */
@Service()
class TitleController {

    public router: Router;
    private titleService: TitleService;
    private userService: UserService;
    private userDataService: UserDataService;

    constructor(
        @Inject()
        titleService: TitleService,
        userService: UserService,
        userDataService: UserDataService) {
        this.titleService = titleService;
        this.userService = userService;
        this.userDataService = userDataService;

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
         *          minimum: 0
         *          maximum: 26
         *          default: 8
         *          description: age filter lower limit value, must be lower than age.lte 
         *          example: 12
         *      - in: query
         *        name: age.lte
         *        schema:
         *          type: integer
         *          minimum: 5
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
        this.router.get("/", Authorize(LevelZero), this.getAllTitles.bind(this));

        //get
        /**
         * @swagger
         * /titles/id/{id}:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to get title details based on Id
         *   description: return title details based on titleId, titleId must be in base64 encoding
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
        this.router.get("/id/:id", Authorize(LevelZero), this.getTitleById.bind(this));

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

        //get
        /**
         * @swagger
         * /titles/available-languages:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to get all available languages
         *   description: returns all available languages
         *   responses:
         *       200:
         *          description: Success
         *       401:
         *          description: Unauthorized
         *       404:
         *          description: Not Found
         *   security: []
         */
        this.router.get("/available-languages", this.getAllAvailableLanguages.bind(this));

        //get
        /**
         * @swagger
         * /titles/available-genres:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to get all available genres
         *   description: returns all available genres
         *   responses:
         *       200:
         *          description: Success
         *       401:
         *          description: Unauthorized
         *       404:
         *          description: Not Found
         *   security: []
         */
        this.router.get("/available-genres", this.getAllAvailableGenres.bind(this));

        //DELETE
        /**
         * @swagger
         * /titles/delete/id/{id}:
         *  delete:
         *   tags:
         *     - Titles
         *   summary: API to delete title based on Id
         *   description: delete's title based on titleId, titleId must be in base64 encoding
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
        this.router.delete("/delete/id/:id", Authorize(LevelThere), this.deleteTitleById.bind(this));

        //PUT
        /**
         * @swagger
         * /titles/update/id/{id}:
         *  put:
         *   tags:
         *     - Titles
         *   summary: API to update title
         *   description: update's title for valid title object
         *   parameters:
         *     - in: path
         *       name: id
         *       schema:
         *          type: string
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
         *          description: Invalid data
         *       401:
         *          description: Unauthorized
         *      
         */
        this.router.put("/update/id/:id", Authorize(LevelTwo), this.updateTitleById.bind(this));
    }

    /**
     * @Get("/") => getAllTitles() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async getAllTitles(req: Request, res: Response, next: NextFunction) {

        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new TitleException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@TitleController.getAllTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.getAllTitles() - userId`);

            const validQuery: FindAllTitlesQueryDTO = await JoiValidator(getAllTitlesQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

            const userData = await this.userDataService.getUserData(userDto._id as string);

            const page: PageDTO = await this.titleService.getAllTitlesWithUserData(validQuery, userDto?._id, userData);

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
            const userName: string | undefined = req?.userName;

            if (!userName) throw new TitleException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@TitleController.getTitleById()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.getTitleById() - userId`);

            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            const titileDTO: TitleDTO = await this.titleService.getTitleByIdWithUserData(titleId, userDto._id);

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

            const userName: string | undefined = req?.userName;

            if (!userName) throw new TitleException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@TitleController.getTitleById()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            const titleDTO: Partial<TitleDTO> = await JoiValidator(baseTitleSchema, req.body, { abortEarly: false, allowUnknown: true, stripUnknown: false });

            const newTitle: TitleDTO = await this.titleService.createTitle(titleDTO, userDto);

            res.status(201).json({ message: "New Title Added Successfully", new_title_id: newTitle._id })

        } catch (error) {

            next(error)
        }
    }


    /**
    * @Get("/available-languages") => getAllAvailableLanguages()
    * @param req 
    * @param res 
    * @param next 
    */
    private async getAllAvailableLanguages(req: Request, res: Response, next: NextFunction) {
        try {

            const languages: LanguageDTO[] = await this.titleService.getAllAvailableLanguages();

            res.status(200).json(languages)
        } catch (error) {
            next(error)
        }
    }


    /**
     * @Get("/available-genres") => getAllAvailableGenres()
     * @param req 
     * @param res 
     * @param next 
     */
    private async getAllAvailableGenres(req: Request, res: Response, next: NextFunction) {
        try {

            const genres: string[] = await this.titleService.getAllAvailableGenres();

            res.status(200).json(genres)

        } catch (error) {

            next(error)
        }
    }

    /**
     * @Delete("/delete/id/:id")
     * @param req 
     * @param res 
     * @param next 
     */
    private async deleteTitleById(req: Request, res: Response, next: NextFunction) {
        try {
            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            await this.titleService.deleteTitleById(titleId);

            res.status(200).json({ message: "Title successfully deleted" })
        } catch (error) {

            next(error);
        }
    }

    private async updateTitleById(req: Request, res: Response, next: NextFunction) {
        try {
            const userName: string | undefined = req?.userName;

            if (!userName) throw new TitleException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@TitleController.updateTitleById()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            const last_modified_by = await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.updateTitleById() - userId`);

            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            const validTitleDTO: Partial<TitleDTO> = { ...req.body, last_modified_by };

            const updateTitleDTO: TitleDTO = await this.titleService.updateTitleById(titleId, validTitleDTO);

            res.status(200).json({ message: "Title Updated Successfully", title: updateTitleDTO })

        } catch (error) {

            next(error)
        }
    }
}

export default TitleController;