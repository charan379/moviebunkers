import Config from "@Config";
import HttpCodes from "@constants/http.codes.enum";
import { LevelZero } from "@constants/user.roles.enum";
import { LoginDTO, UserDTO } from "@dto/user.dto";
import { lgoinSchema } from "@joiSchemas/user.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import { AuthService } from "@service/auth.service";
import JoiValidator from "@utils/joi.validator";
import { CookieOptions, NextFunction, Request, Response, Router } from "express";
import { AuthenticatedUser } from "src/@types";
import { Inject, Service } from "typedi";

/**
 * Controller for handling AUTH related API requests
 * @class AuthController
 */
@Service()
class AuthController {

    /**
     * Instance of AuthService class
     * @private
     */
    private authService: AuthService;

    /**
     * Express router instance
     * @public
     */
    public router: Router = Router();

    /**
     * Initializes AuthController class with AuthService dependency injection
     * @constructor
     * @param {AuthService} authService - instance of AuthService class
     */
    constructor(@Inject() authService: AuthService) {
        this.authService = authService;

        /**
         * @swagger
         * /auth/cookie-auth:
         *  post:
         *   tags:
         *     - Auth
         *   summary: API to Login and set auth cookies
         *   description: sets auth cookie for valid login
         *   requestBody:
         *      content:
         *        application/json:
         *          schema:
         *              $ref: '#/components/schemas/login'
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: user or password incorrect or not found
         *   security: []
         */
        this.router.post("/cookie-auth", this.cookieAuth.bind(this));

        /**
         * @swagger
         * /auth/token-auth:
         *  post:
         *   tags:
         *     - Auth
         *   summary: API to authenticate user and sent token
         *   description: return a token after successfull authentication
         *   requestBody:
         *      content:
         *        application/json:
         *          schema:
         *              $ref: '#/components/schemas/login'
         *   responses:
         *       200:
         *          description: Success
         *       404:
         *          description: user or password incorrect or not found
         *   security: []
         */
        this.router.post("/token-auth", this.tokenAuth.bind(this));

        /**
         * @swagger
         * /auth/logout:
         *  get:
         *   tags:
         *     - Auth
         *   summary: API to logout
         *   description: clears auth cookie
         *   responses:
         *       200:
         *          description: Success
         *       500:
         *          description: Internal Server Error
         *   security: []
         */
        this.router.get("/logout", this.logout.bind(this));


        /**
         * @swagger
         * /auth/who-am-i:
         *  get:
         *   tags:
         *     - Auth
         *   summary: API to get user details with if user logged in
         *   description: return user info based on login cookie
         *   responses:
         *       200:
         *          description: Success
         *       401:
         *          description: Unauthorized
         */
        this.router.get("/who-am-i", Authorize(LevelZero), this.getWhoAmI.bind(this));
    }


    /**
     * Controller method to handle authentication via cookie
     *
     * @route POST /auth/cookie-auth
     * 
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async cookieAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate user login information using the login schema
            const validLoginDTO: LoginDTO = await JoiValidator(lgoinSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false });

            // Generate a JWT token and store it in a cookie
            const { token }: AuthenticatedUser = await this.authService.login(validLoginDTO);
            res.cookie("auth", `Bearer ${token}`, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: Config.HTTPS,
                signed: true,
                overwrite: true,
                sameSite: 'none',
            } as CookieOptions)
                .status(HttpCodes.OK)
                .json({ message: "Successfully Logged In" });
        } catch (error) {
            // Pass any errors to the next middleware function
            next(error)
        }
    }


    /**
     * Controller method to handle API requests for authenticating users with tokens.
     * 
     * @route POST /auth/token-auth
     * 
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async tokenAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate the login credentials sent in the request body
            const validLoginDTO: LoginDTO = await JoiValidator(lgoinSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false });

            // Attempt to authenticate the user with the provided credentials and retrieve a token
            const { userId, userName, email, role, status, updatedAt, createdAt, token }: AuthenticatedUser = await this.authService.login(validLoginDTO);

            // Send a success response with the authentication token
            res.status(HttpCodes.OK)
                .json({
                    userId, userName, email, role, status, updatedAt, createdAt, token
                });

        } catch (error) {
            // If an error occurs, pass it to the next middleware function in the request chain
            next(error)
        }
    }


    /**
     * Controller method to handle API requests for user logout.
     *
     * @route GET /auth/logout
     * 
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Clear the auth cookie
            res.clearCookie("auth", {
                sameSite: "none",
                httpOnly: true,
                secure: Config.HTTPS
            });

            // Return success response
            res.status(HttpCodes.OK).json({ message: "Successfully Logged Out" });
        } catch (error) {
            // Forward any errors to the error handling middleware
            next(error);
        }
    }


    /**
     * Controller to handle API requests for getting the details of the currently logged-in user
     *
     * @route GET /auth/who-am-i
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async getWhoAmI(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userName: string | undefined = req?.userName;

            // Get user details from the authService
            const userDTO: UserDTO = await this.authService.WhoAmI(userName);

            // Send the user details in the response
            res.status(HttpCodes.OK).json(userDTO);
        } catch (error) {
            // Pass any error to the next middleware function
            next(error);
        }
    }


}

export default AuthController;