import { LoginDTO } from "@dto/user.dto";
import { lgoinSchema } from "@joiSchemas/user.joi.schemas";
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
        this.router.post("/login", this.login.bind(this));

        //logout
        this.router.get("/logout", this.logout.bind(this));
    }


    /**
     * @Post("/login") => login() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validLoginDTO: LoginDTO = await JoiValidator(lgoinSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false });

            const token: string = await this.authService.login(validLoginDTO);

            res.cookie("auth", `Bearer ${token}`, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // secure: Config.HTTPS,
                signed: true,
                overwrite: true,
                sameSite: false,
            } as CookieOptions)
            .status(200)
            .json({ message: "Successfully Logged In" });

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

            res.clearCookie("auth")
            .status(200)
            .json({ message: "Successfully Logged Out" })

        } catch (error) {

            next(error)

        }
    }

}

export default AuthController;