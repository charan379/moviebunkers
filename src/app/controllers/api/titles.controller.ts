import HttpCodes from "@constants/http.codes.enum";
import { LevelThere, LevelTwo, LevelZero } from "@constants/user.roles.enum";
import LanguageDTO from "@dto/language.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import TitleException from "@exceptions/title.exeception";
import baseTitleSchema from "@joiSchemas/base.joi.title.schema";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { getAllTitlesQuerySchema } from "@joiSchemas/common.title.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import ITitle from "@models/interfaces/title.interface";
import TitleService from "@service/title.service";
import { UserService } from "@service/user.service";
import UserDataService from "@service/userdata.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Page } from "src/@types";
import { Inject, Service } from "typedi";

/**
 * Controller for handling title related API requests
 * @class TitleController
 */
@Service()
class TitleController {

    public router: Router;
    private titleService: TitleService;
    private userService: UserService;
    private userDataService: UserDataService;

    /**
      * Constructor of TitleController class, creates a new instance for TitleController class
      * @param titleService An instance of TitleService class
      * @param userService An instance of UserService class
      * @param userDataService An instance of UserDataService class
      */
    constructor(
        @Inject()
        titleService: TitleService,
        userService: UserService,
        userDataService: UserDataService) {
        this.titleService = titleService;
        this.userService = userService;
        this.userDataService = userDataService;
        this.router = Router();

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
    * Controller method for handling GET requests to retrieve all titles based on query
    * 
    * @route GET /titles/
    * 
    * @param {Request} req - The HTTP request object
    * @param {Response} res - The HTTP response object
    * @param {NextFunction} next - The function to call to pass the request to the next middleware function
    * @returns {Promise<void>} - void, and sends Page<TitlesDTO> as response
    */
    private async getAllTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object
            const userName: string | undefined = req?.userName;
            // Throw an exception if the username is missing
            if (!userName) throw new TitleException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`,
                `@TitleController.getAllTitles()`);

            // Get the user DTO for the given username
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate that the user ID is a valid ObjectID
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.getAllTitles() - userId`);

            // Validate the query parameters for retrieving all titles
            const validQuery: FindAllTitlesQueryDTO = await JoiValidator(getAllTitlesQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

            // Get the user data for the given user ID
            const userData: UserDataDTO = await this.userDataService.getUserData(userDto._id);

            // Get a paginated list of all titles with user data
            const page: Page<TitleDTO> = await this.titleService.getAllTitlesWithUserData(validQuery, userDto?._id, userData);

            // Send the page of titles as the HTTP response
            res.status(HttpCodes.OK).json(page);

        } catch (error) {
            // Catch any errors that occur and pass them to the next middleware function in the chain (e.g. error-handler or logger)
            next(error)
        }
    }


    /**
    * Controller method for handling GET requests to retrieve title based on id
    * 
    * @route GET /titles/id/:id
    * 
    * @param {Request} req - The HTTP request object
    * @param {Response} res - The HTTP response object
    * @param {NextFunction} next - The function to call to pass the request to the next middleware function
    * @returns {Promise<void>} - void, and sends TitleDTO as response
    */
    private async getTitleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object
            const userName: string | undefined = req?.userName;

            // Throw an exception if the username is missing from the request object
            if (!userName) throw new TitleException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`,
                `@TitleController.getTitleById()`);

            // Get the UserDTO object for the given username
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate that the user ID is a valid object ID
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.getTitleById() - userId`);

            // Decode the title ID from base64 format and validate that it is a valid object ID
            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            // Get the TitleDTO object for the given title ID and user ID
            const titileDTO: TitleDTO = await this.titleService.getTitleByIdWithUserData(titleId, userDto._id);

            // Send the TitleDTO object as the response
            res.status(200).json(titileDTO)

        } catch (error) {

            // Pass any errors to the next middleware function in the chain (e.g. error-handler or logger)
            next(error)
        }
    }


    /**
    * Controller method for handling POST request to create new title
    * 
    * @route POST /titles/new
    * 
    * @param {Request} req - The HTTP request object
    * @param {Response} res - The HTTP response object
    * @param {NextFunction} next - The function to call to pass the request to the next middleware function
    * @returns {Promise<void>} - void, and sends newly created title id and success message as response
    */
    private async createTitle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the user name from the request
            const userName: string | undefined = req?.userName;

            // If user name doesn't exist, throw an exception
            if (!userName) throw new TitleException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`,
                `@TitleController.getTitleById()`
            );

            // Get the user DTO object by user name
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the request body against the base title schema
            const ititle: Partial<ITitle> = await JoiValidator(
                baseTitleSchema,
                req.body,
                { abortEarly: false, allowUnknown: true, stripUnknown: false }
            );

            // Create a new title DTO object
            const newTitle: TitleDTO = await this.titleService.createTitle(ititle, userDto);

            // Send success response with newly created title ID and success message
            res.status(201).json({ message: "New Title Added Successfully", new_title_id: newTitle._id });

        } catch (error) {
            // Catch any errors that occur and pass them to the next middleware function in the chain (e.g. error-handler or logger)
            next(error);
        }
    }



    /**
     * Controller method for handling GET request to fetch all available languages for titles
     * 
     * @route GET /titles/available-languages
     * 
     * @param {Request} req - The HTTP request object
     * @param {Response} res - The HTTP response object
     * @param {NextFunction} next - The function to call to pass the request to the next middleware function
     * @returns {Promise<void>} - A Promise that resolves to void and sends an array of LanguageDTO objects as the response
     */
    private async getAllAvailableLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Call the getAllAvailableLanguages method of the titleService object
            // to get an array of LanguageDTO objects
            const languages: LanguageDTO[] = await this.titleService.getAllAvailableLanguages();
            // Send a JSON response with the status code 200 and the array of LanguageDTO objects
            res.status(200).json(languages);
        } catch (error) {
            // If an error occurs, call the next function with the error object
            // to pass the error to the next middleware function
            next(error);
        }
    }


    /**
     * Controller method for handling GET request to fetch all available genres for titles
     * 
     * @route GET /titles/available-genres
     * 
     * @param {Request} req - The HTTP request object
     * @param {Response} res - The HTTP response object
     * @param {NextFunction} next - The function to call to pass the request to the next middleware function
     * @returns {Promise<void>} - A Promise that resolves to void and sends an array of genres as the response
     */
    private async getAllAvailableGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Call the titleService to retrieve an array of available genres
            const genres: string[] = await this.titleService.getAllAvailableGenres();

            // Send a JSON response containing the array of genres
            res.status(200).json(genres)

        } catch (error) {
            // If an error occurs, pass it to the next middleware function to handle it
            next(error)
        }
    }


    /**
     * Controller method for handling DELETE request to for deleting existing titles
     * 
     * @route GET /titles/delete/id/:id
     * 
     * @param {Request} req - The HTTP request object
     * @param {Response} res - The HTTP response object
     * @param {NextFunction} next - The function to call to pass the request to the next middleware function
     * @returns {Promise<void>} - A Promise that resolves to void and sends success message as the response
     */
    private async deleteTitleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Decode the ID from base64 and validate it using JoiValidator
            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            // Call the titleService to delete the title with the given ID
            await this.titleService.deleteTitleById(titleId);

            // Send a success message as the response
            res.status(200).json({ message: "Title successfully deleted" })
        } catch (error) {
            // Pass the error to the next middleware function
            next(error);
        }
    }


    /**
     * Controller method for handling PUT request to for updating existing titles
     * 
     * @route GET /titles/update/id/:id
     * 
     * @param {Request} req - The HTTP request object
     * @param {Response} res - The HTTP response object
     * @param {NextFunction} next - The function to call to pass the request to the next middleware function
     * @returns {Promise<void>} - A Promise that resolves to void and sends success message and updated titleDTO as the response
     */
    private async updateTitleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract username from request object
            const userName: string | undefined = req?.userName;

            // Throw an error if username is missing from the request object
            if (!userName) throw new TitleException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, 
                userName not exists in request object`,
                `@TitleController.updateTitleById()`);

            // Get user details from the database based on the extracted username
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Get the user's ID for the last_modified_by field of the updated title
            const last_modified_by = await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@TitleController.updateTitleById() - userId`);

            // Decode and validate the title ID from the request parameters
            const titleId = await JoiValidator(ObjectIdSchema, Buffer.from(req?.params?.id, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            // Create a validTitleDTO object by merging the request body with the last_modified_by field
            const validTitleDTO: Partial<ITitle> = { ...req.body, last_modified_by };

            // Update the title based on the ID and the validTitleDTO object
            const updateTitleDTO: TitleDTO = await this.titleService.updateTitleById(titleId, validTitleDTO);

            // Send success message and the updated title object in the response
            res.status(200).json({ message: "Title Updated Successfully", title: updateTitleDTO })

        } catch (error) {

            // Pass the error to the next middleware function
            next(error)
        }
    }

}

export default TitleController;