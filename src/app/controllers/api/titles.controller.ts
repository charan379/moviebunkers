import { NextFunction, Request, Response, Router, RouterOptions } from "express";
import { Service } from "typedi";

/**
 * @Controller("/titles") => TitleController.class
 */
@Service()
class TitleController {

    public router: Router;
    private titleService: any;

    constructor() {
        this.router = Router();

        //get
        this.router.get("/", this.getAllTitles.bind(this));
        this.router.get("/id/:id", this.getTitleById.bind(this));

        //post
        this.router.post("/new", this.createTitle.bind(this));
    }

    /**
     * @Get("/") => getAllTitles() Controller
     * @param req 
     * @param res 
     * @param next 
     */
    private async getAllTitles(req: Request, res: Response, next: NextFunction) {

        try {

            throw new Error("method not implemented")

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

            throw new Error("method not implemented")

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

            throw new Error("method not implemented")

        } catch (error) {

            next(error)
        }
    }
}

export default TitleController;