import { LevelOne, LevelThere, LevelTwo } from "@constants/user.roles.enum";
import LinkDTO from "@dto/link.dto";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import linkSchema from "@joiSchemas/linkSchema";
import Authorize from "@middlewares/authorization.middleware";
import ILink from "@models/interfaces/ILinks";
import LinksService from "@service/links.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * Controller for handling Link related API requests
 * @class LinksController
 */
@Service()
class LinksController {
  private linksService: LinksService;
  public router: Router = Router();

  constructor(@Inject() linksService: LinksService) {
    this.linksService = linksService;

    /**
     * Endpoint for creating a new Link
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
    this.router.post("/new", Authorize(LevelOne), this.newLink.bind(this));

    /**
     * Endpoint for getting Links by Parent ID
     * @swagger
     * /links/parent/{parentId}:
     *  get:
     *   tags:
     *     - Links
     *   summary: API to get links by parent id
     *   description: returns a links for given parentId
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
    this.router.get("/parent/:parentId", Authorize(LevelOne), this.getByParentId.bind(this));

    /**
     * Endpoint for updating an existing new Link
     * @swagger
     * /links/update/{id}:
     *  put:
     *   tags:
     *     - Links
     *   summary: API to update an existing link
     *   description: update's link
     *   requestBody:
     *      content:
     *        application/json:
     *          schema:
     *              $ref: '#/components/schemas/new_link'
     *   parameters:
     *     - in: path
     *       name: id
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       400:
     *          description: Invalid new user
     *       401:
     *          description: Unauthorized
     */
    this.router.put("/update/:id", Authorize(LevelTwo), this.updateLink.bind(this));

    /**
     * Endpoint for deleting a link with _id
     * @swagger
     * /links/delete/{id}:
     *  delete:
     *   tags:
     *     - Links
     *   summary: API to delete link with object id
     *   description: returns a success message after deleting
     *   parameters:
     *     - in: path
     *       name: id
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       400:
     *          description: Invalid id
     *       401:
     *          description: Unauthorized
     */
    this.router.delete("/delete/:id", Authorize(LevelThere), this.delete.bind(this));

    /**
     * Endpoint for deleting all links by Parent ID
     * @swagger
     * /links/delete-many/{parentId}:
     *  delete:
     *   tags:
     *     - Links
     *   summary: API to delete all links by parent id
     *   description: returns a success message after deleting
     *   parameters:
     *     - in: path
     *       name: parentId
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       400:
     *          description: Invalid parentId
     *       401:
     *          description: Unauthorized
     */
    this.router.delete("/delete-many/:parentId", Authorize(LevelThere), this.deleteMany.bind(this));
  }

  /**
   * Controller method for creating a new link.
   * 
   * @route POST /links/new
   * 
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The Express middleware NextFunction.
   * @returns {Promise<void>} - A Promise that resolves to nothing.
   */
  private async newLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate the incoming request body against the link schema.
      const newLink: ILink = await JoiValidator(linkSchema, req?.body, {
        allowUnknown: false,
        stripUnknown: true,
        abortEarly: false,
      });

      // Create the new link using the LinksService.
      const link: LinkDTO = await this.linksService.create(newLink);

      // Return the created link in the response.
      res.status(201).json(link);
    } catch (error) {
      // Pass any errors on to the Express error handling middleware.
      next(error);
    }
  }

  /**
   * Controller method to get all links associated with a parent ID.
   *
   * @route POST /links/parent/:parentId
   * 
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction object.
   * @returns void
   */
  private async getByParentId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate parent ID using Joi.
      const parentId: string = await JoiValidator(
        ObjectIdSchema,
        req?.params?.parentId,
        { allowUnknown: false, stripUnknown: true, abortEarly: false }
      );

      // Retrieve all links associated with the parent ID using the LinksService.
      const linkDTOs: LinkDTO[] = await this.linksService.getLinksByParentId(
        parentId
      );

      // Send a response containing the linkDTOs array in JSON format.
      res.status(201).json(linkDTOs);
    } catch (error) {
      // Forward any errors to the Express error handler.
      next(error);
    }
  }

  /**
   * Controller method for updating an existing link.
   * 
   * @route PUT /links/update/:id
   * 
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The Express middleware NextFunction.
   * @returns {Promise<void>} - A Promise that resolves to nothing.
   */
  private async updateLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate object ID using Joi.
      const objectId: string = await JoiValidator(
        ObjectIdSchema,
        req?.params?.id,
        { allowUnknown: false, stripUnknown: true, abortEarly: false }
      );

      // Validate the incoming request body against the link schema.
      const update: ILink = await JoiValidator(linkSchema, req?.body, {
        allowUnknown: false,
        stripUnknown: true,
        abortEarly: false,
      });

      // Create the new link using the LinksService.
      const link: LinkDTO = await this.linksService.updateById(
        objectId,
        update
      );

      // Return the created link in the response.
      res.status(200).json(link);
    } catch (error) {
      // Pass any errors on to the Express error handling middleware.
      next(error);
    }
  }

  /**
   * Controller method to delete link associated with a ID.
   *
   * @route DELETE /links/delete/:id
   * 
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction object.
   * @returns void
   */
  private async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate object ID using Joi.
      const objectId: string = await JoiValidator(
        ObjectIdSchema,
        req?.params?.id,
        { allowUnknown: false, stripUnknown: true, abortEarly: false }
      );
      // delete link which has input objectId
      await this.linksService.deleteById(objectId);
      // Send a response after deleting link in JSON format.
      res.status(200).json({
        messsage: "Successfully Deleted",
      });
    } catch (error) {
      // Forward any errors to the Express error handler.
      next(error);
    }
  }

  /**
   * Controller method to delete all links associated with a parentId.
   *
   * @route DELETE /links/delete-many/:parentId
   * 
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction object.
   * @returns void
   */
  private async deleteMany(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate parent ID using Joi.
      const parentId: string = await JoiValidator(
        ObjectIdSchema,
        req?.params?.parentId,
        { allowUnknown: false, stripUnknown: true, abortEarly: false }
      );
      // delete all link which has given parent id
      await this.linksService.deleteManyByParentId(parentId);
      // Send a response after deleting links in JSON format.
      res.status(200).json({
        messsage: "Successfully Deleted",
      });
    } catch (error) {
      // Forward any errors to the Express error handler.
      next(error);
    }
  }
}

export default LinksController;
