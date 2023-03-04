import TitleDTO from "@dto/title.dto";
import baseTitleSchema from "@joiSchemas/base.joi.title.schema";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
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

            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {abortEarly: false, allowUnknown: false, stripUnknown: true})
            
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
            
            res.status(201).json({message:"New Title Added Successfully",new_title_id: newTitle._id})

        } catch (error) {

            next(error)
        }
    }
}

export default TitleController;