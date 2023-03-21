import Config from "@Config";
import HttpCodes from "@constants/http.codes.enum";
import { LevelZero } from "@constants/user.roles.enum";
import { LoginDTO, UserDTO } from "@dto/user.dto";
import { lgoinSchema } from "@joiSchemas/user.joi.schemas";
import Authorize from "@middlewares/authorization.middleware";
import { AuthService } from "@service/auth.service";
import JoiValidator from "@utils/joi.validator";
import { CookieOptions, NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * @Controller("/auth") => AuthController.class
 */
@Service()
class AuthController {

    private authService: AuthService;

    public router: Router = Router();
    constructor(@Inject() authService: AuthService) {
        this.authService = authService;

        //login
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

        //logout
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
     * @Post("/cookie-auth") => cookieAuth() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async cookieAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validLoginDTO: LoginDTO = await JoiValidator(lgoinSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false });

            const token: string = await this.authService.login(validLoginDTO);

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

            next(error)
        }
    }

    /**
     * @Post("/token-auth") => tokenAuth() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async tokenAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validLoginDTO: LoginDTO = await JoiValidator(lgoinSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false });

            const token: string = await this.authService.login(validLoginDTO);

            res.status(HttpCodes.OK)
                .json({ message: "Successfully authenticated", token: token });

        } catch (error) {

            next(error)
        }
    }

    /**
     * @Get("/logout") => logout() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            res.clearCookie("auth", { sameSite: "none", httpOnly: true, secure: Config.HTTPS })
                .status(HttpCodes.OK)
                .json({ message: "Successfully Logged Out" })

        } catch (error) {

            next(error)

        }
    }

    /**
     * @Get("/who-am-i") => getWhoAmI() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async getWhoAmI(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userName: string | undefined = req?.userName;

            const userDTO: UserDTO = await this.authService.WhoAmI(userName);

            delete userDTO.password;

            res.status(HttpCodes.OK).json(userDTO);
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;