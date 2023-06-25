import HttpCodes from "@constants/http.codes.enum";
import { LevelOne, LevelThere } from "@constants/user.roles.enum";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import UserDataException from "@exceptions/userdata.exception";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import { UserService } from "@service/user.service";
import UserDataService from "@service/userdata.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * @class UserDataController
* Controller class for handling CRUD operations related to user data.
* Uses middleware for authorization and validation using JoiValidator.
* Injects UserDataService and UserService for accessing user data and user information.
*/
@Service()
class UserDataController {

    public router: Router;

    private userDataService: UserDataService;
    private userService: UserService;

    /**
     * Creates an instance of UserDataController.
     *
     * @param {UserDataService} userDataService - Instance of UserDataService.
     * @param {UserService} userService - Instance of UserService.
     */
    constructor(
        @Inject()
        userDataService: UserDataService,
        userService: UserService) {
        this.userDataService = userDataService;
        this.userService = userService;
        this.router = Router();

        /**
         * @swagger
         * /userdata/init:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to initializes UserData for auhtorizied user
         *   description: returns UserData after initialized
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid userName
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/init", Authorize(LevelOne), this.createUserData.bind(this));

        /**
         * @swagger
         * /userdata:
         *  get:
         *   tags:
         *     - UserData
         *   summary: API to get UserData for auhtorizied user
         *   description: returns UserData for  auhtorizied user
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid userName
         *       401:
         *          description: Unauthorized
         */
        this.router.get("/", Authorize(LevelOne), this.getUserData.bind(this));

        /**
         * @swagger
         * /userdata/get-all:
         *  get:
         *   tags:
         *     - UserData
         *   summary: API to get all UserData's  as list 
         *   description: returns list of UserData 
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid userName
         *       401:
         *          description: Unauthorized
         */
        this.router.get("/get-all", Authorize(LevelThere), this.getAllUsersData.bind(this));

        /**
         * @swagger
         * /userdata/add-to-seen/{titleId}:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to add titleId to user's seen list
         *   description: add's title to seen, titleId must be in base64 encoding 
         *   parameters:
         *     - in: path
         *       name: titleId
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid titleId
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/add-to-seen/:titleId", Authorize(LevelOne), this.addToSeenTitles.bind(this));

        /**
         * @swagger
         * /userdata/add-to-unseen/{titleId}:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to add titleId to user's unseen list
         *   description: add's title to unseen, titleId must be in base64 encoding 
         *   parameters:
         *     - in: path
         *       name: titleId
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid titleId
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/add-to-unseen/:titleId", Authorize(LevelOne), this.addToUnSeenTitles.bind(this));

        /**
        * @swagger
        * /userdata/add-to-favourite/{titleId}:
        *  post:
        *   tags:
        *     - UserData
        *   summary: API to add titleId to user's favourite list
        *   description: add's title to favourite, titleId must be in base64 encoding 
        *   parameters:
        *     - in: path
        *       name: titleId
        *       schema:
        *          type: string
        *   responses:
        *       200:
        *          description: Success
        *       404:
        *          description: User not found
        *       400:
        *          description: Invalid titleId
        *       401:
        *          description: Unauthorized
        */
        this.router.post("/add-to-favourite/:titleId", Authorize(LevelOne), this.addToFavouriteTitles.bind(this));

        /**
         * @swagger
         * /userdata/remove-from-favourite/{titleId}:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to remove titleId to user's favourite list
         *   description: removes's title from favourite, titleId must be in base64 encoding 
         *   parameters:
         *     - in: path
         *       name: titleId
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid titleId
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/remove-from-favourite/:titleId", Authorize(LevelOne), this.removeFromFavouriteTitles.bind(this));

        /**
         * @swagger
         * /userdata/add-to-starred/{titleId}:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to add titleId to user's starred list
         *   description: add's title to starred, titleId must be in base64 encoding 
         *   parameters:
         *     - in: path
         *       name: titleId
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid titleId
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/add-to-starred/:titleId", Authorize(LevelOne), this.addToStarredTitles.bind(this));

        /**
         * @swagger
         * /userdata/remove-from-starred/{titleId}:
         *  post:
         *   tags:
         *     - UserData
         *   summary: API to remove titleId to user's starred list
         *   description: removes's title from starred, titleId must be in base64 encoding 
         *   parameters:
         *     - in: path
         *       name: titleId
         *       schema:
         *          type: string
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: User not found
         *       400:
         *          description: Invalid titleId
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/remove-from-starred/:titleId", Authorize(LevelOne), this.removeFromStarredTitles.bind(this));
    }

    /**
     * Creates a new user data for the authenticated user and returns it as a JSON response.
     * 
     * @route POST /userdata/init
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     */
    private async createUserData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            // Get the authenticated user's username from the request object.
            const userName: string | undefined = req?.userName;

            // Throw an exception if the username does not exist in the request object.
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.createUserData()`);

            // Get the authenticated user's user DTO using the username.
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate that the user DTO's ID is a valid ObjectId.
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            // Create a new user data object using the user DTO's ID.
            const createdUserData = await this.userDataService.create(userDto._id as string);

            // Return the created user data object as a JSON response with status code 201.
            res.status(201).json(createdUserData);
        } catch (error) {
            // Pass any errors to the next middleware function in the error-handling chain.
            next(error)
        }
    }


    /**
     * Retrieves user data for the currently authenticated user.
     * 
     * @route GET /
     * 
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    private async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const userName: string | undefined = req?.userName;

            // Check if the user name exists in the request object
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.getUserData()`);

            // Retrieve user data from the user service based on the user name
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate that the user id retrieved from the user service is a valid MongoDB ObjectId
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            // Retrieve the user data from the user data service based on the user id
            const userData: UserDataDTO = await this.userDataService.getUserData(userDto._id as string);

            // Return the user data in the response
            res.status(200).json(userData);

        } catch (error) {
            // Pass any errors to the next middleware function in the error-handling chain.
            next(error)
        }
    }



    /**
      * Adds a title to the user's list of seen titles.
      * 
      * @route POST /userdata/add-to-seen/:titleId
      * 
      * @param {Request} req - Express request object.
      * @param {Response} res - Express response object.
      * @param {NextFunction} next - Express next middleware function.
      */
    private async addToSeenTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the user name from the request object.
            const userName: string | undefined = req?.userName;

            // If the user name is missing, throw an exception.
            if (!userName) {
                throw new UserDataException(
                    "User details missing in request",
                    HttpCodes.BAD_REQUEST,
                    `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToSeenTitles()`);
            }

            // Get the user DTO from the user service.
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user ID from the DTO using Joi schema validation.
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true },
                `UserDataController.addToSeenTitles() - userId`);

            // Validate the title ID from the request parameters using Joi schema validation.
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(),
                { abortEarly: false, allowUnknown: false, stripUnknown: true }, `UserDataController.addToSeenTitles() - titleId`);

            // Add the title to the user's list of seen titles using the user data service.
            const result = await this.userDataService.addToSeenTitles(userDto._id as string, validTitleId as string);

            // Return a success or failure response based on the result.
            if (result) {
                res.status(200).json({ message: "Successfully added to seen titles" });
            } else {
                res.status(200).json({ message: "Failed to add in seen titles" });
            }
        } catch (error) {
            // Pass the error to the next middleware function.
            next(error);
        }
    }

    /**
     * Adds a title to a user's unseen titles list.
     * 
     * @route POST /userdata/add-to-unseen/:titleId
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next function.
     * @returns Promise<void>
     */
    private async addToUnSeenTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object.
            const userName: string | undefined = req?.userName;

            // If the username is undefined, throw a UserDataException.
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToUnSeenTitles()`);

            // Get the user DTO by username.
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user ID.
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToUnSeenTitles() - userId`);

            // Validate the title ID.
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `UserDataController.addToUnSeenTitles() - titleId`)

            // Add the title to the user's unseen titles list.
            const result = await this.userDataService.addToUnSeenTitles(userDto._id as string, validTitleId as string)

            // Send a response based on the result.
            if (result) {
                res.status(200).json({ message: "Successfully added to unseen titles" })
            } else {
                res.status(200).json({ message: "Failed to add in unseen titles" })
            }
        } catch (error) {
            // Call the next function with the error.
            next(error)
        }
    }


    /**
    * Controller method to add a title to the user's favorite titles.
    * 
    * @route POST /userdata/add-to-favourite/:titleId
    * 
    * @param {Object} req - The request object.
    * @param {Object} res - The response object.
    * @param {Function} next - The next function.
    * @returns {Promise<void>} - A promise that resolves with no return value.
    */
    private async addToFavouriteTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object
            const userName: string | undefined = req?.userName;

            // If the username doesn't exist, throw an exception
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToFavouriteTitles()`);

            // Get the user DTO based on the username
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user ID using the ObjectIdSchema
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToFavouriteTitles() - userId`);

            // Validate the title ID using the ObjectIdSchema
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToFavouriteTitles() - titleId`)

            // Add the title to the user's favorite titles using the user ID and title ID
            const result = await this.userDataService.addToFavouriteTitles(userDto._id as string, validTitleId as string)

            // Return a success message if the title was added successfully, or an error message if it failed
            if (result) {
                res.status(200).json({ message: "Successfully added to favourite titles" })
            } else {
                res.status(200).json({ message: "Failed to add in favourite titles" })
            }
        } catch (error) {
            // Call the next function with the error object
            next(error)
        }
    }

    /**
      * Removes a title from the user's list of favorite titles.
      * 
      * @route GET /userdata/remove-from-favourite/:titleId
      * 
      * @param req The request object.
      * @param res The response object.
      * @param next The next function in the middleware chain.
      */
    private async removeFromFavouriteTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object
            const userName: string | undefined = req?.userName;

            // Throw an error if the username is not defined
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.removeFromFavouriteTitles()`);

            // Get the user's data from the database
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user's ID
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromFavouriteTitles() - userId`);

            // Decode and validate the title ID
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromFavouriteTitles() - titleId`)

            // Remove the title from the user's list of favorite titles
            const result = await this.userDataService.removeFromFavouriteTitles(userDto._id as string, validTitleId as string)

            // Return a success or failure message to the client
            if (result) {
                res.status(200).json({ message: "Successfully removed from favourite titles" })
            } else {
                res.status(200).json({ message: "Failed to remove from favourite titles" })
            }
        } catch (error) {
            // Pass the error to the next function in the middleware chain
            next(error)
        }
    }

    /**
     * Adds a title to the user's starred titles list.
     * 
     * @route POST /userdata/add-to-starred/:titleId
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
     */
    private async addToStarredTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the username from the request object
            const userName: string | undefined = req?.userName;

            // If the username doesn't exist, throw an exception
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`,
                `@UserDataController.addToStarredTitles()`);

            // Get the user DTO from the UserService
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user ID
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToStarredTitles() - userId`);

            // Validate the title ID
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToStarredTitles() - titleId`)

            // Add the title to the user's starred titles list
            const result = await this.userDataService.addToStarredTitles(userDto._id as string, validTitleId as string)

            // Return a success or failure message
            if (result) {
                res.status(200).json({ message: "Successfully added to starred titles" })
            } else {
                res.status(200).json({ message: "Failed to add in starred titles" })
            }
        } catch (error) {
            // Pass any errors to the Express error handler
            next(error)
        }
    }

    /**
      * Removes a title from the user's list of starred titles.
      * 
      * @route GET /userdata/remove-from-starred/:titleId
      * 
      * @param req The request object containing the user name and title ID
      * @param res The response object used to send the response to the client
      * @param next The next middleware function in the chain
      */
    private async removeFromStarredTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the user name from the request object
            const userName: string | undefined = req?.userName;

            // Throw an error if the user name is missing
            if (!userName) throw new UserDataException(
                "User details missing in request",
                HttpCodes.BAD_REQUEST,
                `userName: ${userName}, userName not exists in request object`, `@UserDataController.removeFromStarredTitles()`);

            // Get the user DTO using the user name
            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            // Validate the user ID
            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromStarredTitles() - userId`);

            // Validate the title ID
            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromStarredTitles() - titleId`)

            // Remove the title from the user's starred titles list
            const result = await this.userDataService.removeFromStarredTitles(userDto._id as string, validTitleId as string)

            // Send the response based on the result
            if (result) {
                res.status(200).json({ message: "Successfully removed from starred titles" })
            } else {
                res.status(200).json({ message: "Failed to remove from starred titles" })
            }
        } catch (error) {
            // Pass the error to the next middleware function
            next(error)
        }
    }
    /**
     * Gets all users data
      * 
      * @route GET /userdata/get-all
      * 
      * @param req The request object containing the user name and title ID
      * @param res The response object used to send the response to the client
      * @param next The next middleware function in the chain
      */
    private async getAllUsersData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            // Call the service to get data for all users
            const list = await this.userDataService.getAllUsersData();

            // Send the list of users in the response
            res.status(200).json(list);

        } catch (error) {
            // Call the error-handling middleware if an error is caught
            next(error);
        }
    }

}

export default UserDataController;