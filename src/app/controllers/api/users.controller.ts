import { FindAllUsersQueryDTO, NewUserDTO, UpdateUserDTO, UserDTO } from "@dto/user.dto";
import HttpCodes from "@constants/http.codes.enum";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { emailSchema, findAllUserQuerySchema, newUserSchema, userNameSchema, userUpdateSchema } from "@joiSchemas/user.joi.schemas";
import { UserService } from "@service/user.service";
import JoiValidator from "@utils/joi.validator";
import debugLogger from "debug";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";
import PageDTO from "@dto/page.dto";
import Authorize from "@middlewares/authorization.middleware";
import UserRoles from "@constants/user.roles.enum";

/**
 * @Controller("/users") => UserController.class
 */
@Service()
class UserController {
  private debug = debugLogger("moviebunkers:[UserController.class]");

  public router: Router;
  private userService: UserService;

  constructor(@Inject() userService: UserService) {
    this.userService = userService;
    this.router = Router();

    /**
     * @swagger
     * /users:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to to get all users
     *   description: return users for given query
     *   parameters:
     *      - in: query
     *        name: role
     *        schema:
     *          type: string
     *          enum: ['Admin','User','Moderator']
     *      - in: query
     *        name: status
     *        schema:
     *          type: string
     *          enum: ['Active', 'Inactive']
     *      - in: query
     *        name: email
     *        schema:
     *          type: email
     *      - in: query
     *        name: userName
     *        schema:
     *         type: string
     *      - in: query
     *        name: page
     *        schema:
     *          type: integer
     *      - in: query
     *        name: limit
     *        schema:
     *          type: integer
     *      - in: query
     *        name: sort_by
     *        schema:
     *          type: string
     *
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: Invalid new user
     *   
     */
    this.router.get("/", Authorize([UserRoles.ADMIN]), this.getAllUsers.bind(this));

    /**
     * @swagger
     * /users/id/{id}:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to get user by id
     *   description: returns user by object id
     *   parameters:
     *     - in: path
     *       name: id
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     */
    this.router.get("/id/:id", Authorize([UserRoles.ADMIN]), this.getUserById.bind(this));

    /**
     * @swagger
     * /users/{userName}:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to get user by userName
     *   description: returns user by userName
     *   parameters:
     *     - in: path
     *       name: userName
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     */
    this.router.get("/:userName", Authorize([UserRoles.ADMIN, UserRoles.MODERATOR, UserRoles.USER]), this.getUserByUserName.bind(this));

    /**
     * @swagger
     * /users/email/{email}:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to get user by email
     *   description: returns user by email
     *   parameters:
     *     - in: path
     *       name: email
     *       schema:
     *          type: string
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     */
    this.router.get("/email/:email", Authorize([UserRoles.ADMIN]), this.getUserByEmail.bind(this));


    /**
   * @swagger
   * /users/new:
   *  post:
   *   tags:
   *     - Users
   *   summary: API to create new user
   *   description: create a user for valid user object
   *   requestBody:
   *      content:
   *        application/json:
   *          schema:
   *              $ref: '#/components/schemas/new_user'
   *   security: []
   *   responses:
   *       201:
   *          description: Success
   *       401:
   *          description: Invalid new user
   */
    this.router.post("/new", Authorize([UserRoles.ADMIN]), this.createUser.bind(this));

    /**
     * @swagger
     * /users/update/{userName}:
     *  put:
     *   tags:
     *     - Users
     *   summary: API to update user role, status
     *   description: can update user status and role
     *   parameters:
     *     - in: path
     *       name: userName
     *       schema:
     *          type: string
     *   requestBody:
     *      content:
     *        application/json:
     *          schema:
     *              $ref: '#/components/schemas/update_user'
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     */
    this.router.put("/update/:userName", Authorize([UserRoles.ADMIN]), this.updateUser.bind(this))

  }

  /**
   * @Get("/") => getAllUsers() Controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

      const queryDTO: FindAllUsersQueryDTO = await JoiValidator(findAllUserQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

      const users: PageDTO = await this.userService.getAllUsers(queryDTO);

      res.status(HttpCodes.OK).json(users);

    } catch (error) {

      next(error);
    }
  }

  /**
   * @Get("/id/:id") => getUserById() Controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate userId is mongooDB Object Id
      const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, { abortEarly: false, stripUnknown: true });

      // ask userService.getUserById() method to return user for given id 
      const userDTO: UserDTO = await this.userService.getUserById(validId);

      // respond wiht code 200 and userDTO to client 
      res.status(HttpCodes.OK).json(userDTO)

    } catch (error) { // will catch if any errors are thrwon in process

      // pass errror to next() function in chain probably error-handler or logger
      next(error)
    }
  }

  /**
   * Get("/:userName") => getUserByUserName() Controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async getUserByUserName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate userName
      const validUserName = await JoiValidator(userNameSchema, req?.params?.userName, { abortEarly: false, stripUnknown: true });

      const userDTO: UserDTO = await this.userService.getUserByUserName(validUserName);

      delete userDTO.password;

      res.status(HttpCodes.OK).json(userDTO);

    } catch (error) {

      next(error)
    }
  }

  /**
   * Get("/email/:email") => getUserByEmail() Controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const validEmail = await JoiValidator(emailSchema, req?.params?.email, { abortEarly: false, stripUnknown: true });

      const userDTO: UserDTO = await this.userService.getUserByEmail(validEmail);

      res.status(HttpCodes.OK).json(userDTO)
    } catch (error) {

      next(error)
    }
  }

  /**
   * Post("/new") => createUser() Controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validNewUser: NewUserDTO = await JoiValidator(newUserSchema, req.body, { abortEarly: false, stripUnknown: true });

      const createdUser: UserDTO = await this.userService.createUser(validNewUser);

      res.status(201).json(createdUser);

    } catch (error) {

      next(error)
    }
  }

  /**
   * @Put("/update/:userName") => updateUser() Controller
   * updateUser ( role, status only)
   * @param req 
   * @param res 
   * @param next 
   */
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const validUserName = await JoiValidator(userNameSchema, req?.params?.userName, { abortEarly: false, stripUnknown: true });

      const validUserUpdateBody = await JoiValidator(userUpdateSchema, req?.body, { abortEarly: false, stripUnknown: true });

      const userUpdateDTO: UpdateUserDTO = {
        ...validUserUpdateBody,
        last_modified_by: "dev"
      }

      const userDTO: UserDTO = await this.userService.updateUserByUserName(validUserName, userUpdateDTO);

      res.status(200).json(userDTO)
    } catch (error) {
      next(error)
    }
  }

}

export default UserController;