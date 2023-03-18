import HttpCodes from "@constants/http.codes.enum";
import { LevelThere, LevelZero } from "@constants/user.roles.enum";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import UserDataException from "@exceptions/userdata.exception";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import { UserService } from "@service/user.service";
import UserDataService from "@service/userdata.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongoose";
import { Inject, Service } from "typedi";


@Service()
class UserDataController {

    public router: Router;

    private userDataService: UserDataService;
    private userService: UserService;


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
        this.router.post("/init", Authorize(LevelZero), this.createUserData.bind(this));

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
        this.router.get("/", Authorize(LevelZero), this.getUserData.bind(this));

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

        this.router.post("/add-to-seen/:titleId", Authorize(LevelZero), this.addToSeenTitles.bind(this));

        this.router.post("/add-to-unseen/:titleId", Authorize(LevelZero), this.addToUnSeenTitles.bind(this));

        this.router.post("/add-to-favourite/:titleId", Authorize(LevelZero), this.addToFavouriteTitles.bind(this));

        this.router.post("/remove-from-favourite/:titleId", Authorize(LevelZero), this.removeFromFavouriteTitles.bind(this));

        this.router.post("/add-to-starred/:titleId", Authorize(LevelZero), this.addToStarredTitles.bind(this));

        this.router.post("/remove-from-starred/:titleId", Authorize(LevelZero), this.removeFromStarredTitles.bind(this));
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    private async createUserData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.createUserData()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            const createdUserData = await this.userDataService.create(userDto._id as ObjectId);

            res.status(201).json(createdUserData);
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    private async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.getUserData()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true })

            const userData: UserDataDTO = await this.userDataService.getUserData(userDto._id as ObjectId);

            res.status(200).json(userData);

        } catch (error) {
            next(error)
        }
    }


    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    private async addToSeenTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToSeenTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `UserDataController.addToSeenTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `UserDataController.addToSeenTitles() - titleId`)

            const result = await this.userDataService.addToSeenTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully added to seen titles" })
            } else {
                res.status(200).json({ message: "Failed to add in seen titles" })
            }
        } catch (error) {

            next(error)
        }
    }

    /**
    * 
    * @param req 
    * @param res 
    * @param next 
    */
    private async addToUnSeenTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToUnSeenTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToUnSeenTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `UserDataController.addToUnSeenTitles() - titleId`)

            const result = await this.userDataService.addToUnSeenTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully added to unseen titles" })
            } else {
                res.status(200).json({ message: "Failed to add in unseen titles" })
            }
        } catch (error) {

            next(error)
        }
    }


    /**
    * 
    * @param req 
    * @param res 
    * @param next 
    */
    private async addToFavouriteTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToFavouriteTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToFavouriteTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToFavouriteTitles() - titleId`)

            const result = await this.userDataService.addToFavouriteTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully added to favourite titles" })
            } else {
                res.status(200).json({ message: "Failed to add in favourite titles" })
            }
        } catch (error) {

            next(error)
        }
    }

    /**
    * 
    * @param req 
    * @param res 
    * @param next 
    */
    private async removeFromFavouriteTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.removeFromFavouriteTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromFavouriteTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromFavouriteTitles() - titleId`)

            const result = await this.userDataService.removeFromFavouriteTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully removed from favourite titles" })
            } else {
                res.status(200).json({ message: "Failed to remove from favourite titles" })
            }
        } catch (error) {

            next(error)
        }
    }


    /**
    * 
    * @param req 
    * @param res 
    * @param next 
    */
    private async addToStarredTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.addToStarredTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToStarredTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.addToStarredTitles() - titleId`)

            const result = await this.userDataService.addToStarredTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully added to starred titles" })
            } else {
                res.status(200).json({ message: "Failed to add in starred titles" })
            }
        } catch (error) {

            next(error)
        }
    }

    /**
    * removeFromStarredTitles
    * @param req 
    * @param res 
    * @param next 
    */
    private async removeFromStarredTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userName: string | undefined = req?.userName;

            if (!userName) throw new UserDataException("Internal Servicer Error", HttpCodes.INTERNAL_SERVER_ERROR, `userName: ${userName}, userName not exists in request object`, `@UserDataController.removeFromStarredTitles()`);

            const userDto: UserDTO = await this.userService.getUserByUserName(userName);

            await JoiValidator(ObjectIdSchema, userDto._id?.toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromStarredTitles() - userId`);

            const validTitleId = await JoiValidator(ObjectIdSchema, Buffer.from(req.params?.titleId, 'base64url').toString(), { abortEarly: false, allowUnknown: false, stripUnknown: true }, `@UserDataController.removeFromStarredTitles() - titleId`)

            const result = await this.userDataService.removeFromStarredTitles(userDto._id as ObjectId, validTitleId as ObjectId)

            if (result) {
                res.status(200).json({ message: "Successfully removed from starred titles" })
            } else {
                res.status(200).json({ message: "Failed to remove from starred titles" })
            }
        } catch (error) {

            next(error)
        }
    }
    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    private async getAllUsersData(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const list = await this.userDataService.getAllUsersData();
            res.status(200).json(list);
        } catch (error) {
            next(error)
        }
    }
}

export default UserDataController;