import UserRoles from "@constants/user.roles.enum";
import TitleDTO from "@dto/title.dto";
import baseTitleSchema from "@joiSchemas/base.joi.title.schema";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
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
        this.router.get("/", Authorize([UserRoles.ADMIN, UserRoles.MODERATOR, UserRoles.USER]), this.getAllTitles.bind(this));

        /**
         * @swagger
         * /id/{id}:
         *  get:
         *   tags:
         *     - Titles
         *   summary: API to to title details base Id
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
         *       404: Not Found
         */
        this.router.get("/id/:id",Authorize([UserRoles.ADMIN, UserRoles.MODERATOR, UserRoles.USER]), this.getTitleById.bind(this));

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
        this.router.post("/new",Authorize([UserRoles.ADMIN, UserRoles.MODERATOR]),  this.createTitle.bind(this));
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