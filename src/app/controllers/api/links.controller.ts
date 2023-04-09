import { LevelOne } from "@constants/user.roles.enum";
import LinkDTO from "@dto/link.dto";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import linkSchema from "@joiSchemas/linkSchema";
import Authorize from "@middlewares/authorization.middleware";
import ILink from "@models/interfaces/ILinks";
import LinksService from "@service/links.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";


@Service()
class LinksController {
    private linksService: LinksService
    public router: Router = Router();

    constructor(@Inject() linksService: LinksService) {
        this.linksService = linksService;

        /**
        * @swagger
        * /links/new:
        *  post:
        *   tags:
        *     - Links
        *   summary: API to create new link
        *   description: create a link for valid link object
        *   requestBody:
        *      content:
        *        application/json:
        *          schema:
        *              $ref: '#/components/schemas/new_link'
        *   responses:
        *       201:
        *          description: Success
        *       400:
        *          description: Invalid new user
        *       401:
        *          description: Unauthorized
        */
        this.router.post('/new', Authorize(LevelOne), this.newLink.bind(this))

        /**
        * @swagger
        * /links/parent/{parentId}:
        *  get:
        *   tags:
        *     - Links
        *   summary: API to get links by parent id
        *   description: returns a links links for given parentId
        *   parameters:
        *     - in: path
        *       name: parentId
        *       schema:
        *          type: string
        *   responses:
        *       201:
        *          description: Success
        *       400:
        *          description: Invalid parentId
        *       401:
        *          description: Unauthorized
        */
        this.router.get('/parent/:parentId', Authorize(LevelOne), this.getByParentId.bind(this))
    }


    private async newLink(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newLink: ILink = await JoiValidator(linkSchema, req?.body, { allowUnknown: false, stripUnknown: true, abortEarly: false })
            const link: LinkDTO = await this.linksService.create(newLink)
            res.status(201).json(link);
        } catch (error) {
            next(error)
        }
    }

    private async getByParentId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const parentId: string = await JoiValidator(ObjectIdSchema, req?.params?.parentId, { allowUnknown: false, stripUnknown: true, abortEarly: false })
            const linkDTOs: LinkDTO[] = await this.linksService.getAllByParentId(parentId);

            res.status(201).json(linkDTOs);
        } catch (error) {
            next(error)
        }
    }
}

export default LinksController;