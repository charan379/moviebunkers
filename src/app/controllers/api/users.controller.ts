import { FindAllUsersQueryDTO, NewUserDTO, UpdateUserDTO, UserDTO } from "@dto/user.dto";
import HttpCodes from "@constants/http.codes.enum";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { emailSchema, findAllUserQuerySchema, msAdmUpdatePassSchema, newUserSchema, passwordSchema, userNameSchema, userUpdateSchema } from "@joiSchemas/user.joi.schemas";
import { UserService } from "@service/user.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";
import PageDTO from "@dto/page.dto";
import Authorize from "@middlewares/authorization.middleware";
import { LevelOne, LevelThere, LevelTwo } from "@constants/user.roles.enum";
import UserException from "@exceptions/user.exception";
import Config from "@Config";

/**
 * Controller for handling user related API requests
 * @class UserController
 */
@Service()
class UserController {
  public router: Router;
  private userService: UserService;

  /**
  * Constructor of UserController class
  * @param userService An instance of UserService class
  */
  constructor(@Inject() userService: UserService) {
    this.userService = userService;
    this.router = Router();

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
     *       400:
     *          description: Invalid new user
     *       401:
     *          description: Unauthorized
     */
    this.router.post("/new", this.createUser.bind(this));

    /**
     * @swagger
     * /users:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to get all users
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
     *       400:
     *          description: Invalid query
     *       401:
     *          description: Unauthorized
     *   
     */
    this.router.get("/", Authorize(LevelThere), this.getAllUsers.bind(this));

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
     *       400:
     *          description: Invalid id
     *       401:
     *          description: Unauthorized
     */
    this.router.get("/id/:id", Authorize(LevelThere), this.getUserById.bind(this));

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
     *       400:
     *          description: Invalid userName
     *       401:
     *          description: Unauthorized
     */
    this.router.get("/:userName", Authorize(LevelOne), this.getUserByUserName.bind(this));

    /**
     * @swagger
     * /users/account-status/{idtype}/{id}:
     *  get:
     *   tags:
     *     - Users
     *   summary: API to get user account status by userName / email
     *   description: returns username, account status
     *   parameters:
     *     - in: path
     *       name: idtype
     *       schema:
     *          type: string
     *          enum: [userName, email]
     *     - in: path
     *       name: id
     *       schema:
     *          type: string
     *   security: []
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     *       400:
     *          description: Invalid id type
     */
    this.router.get("/account-status/:idtype/:id", this.getUserAccountStatus.bind(this));

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
     *       400:
     *          description: invalid email
     *       401:
     *          description: Unauthorized
     */
    this.router.get("/email/:email", Authorize(LevelThere), this.getUserByEmail.bind(this));

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
     *       401:
     *          description: Unauthorized
     *       400:
     *          description: Invalid Update
     */
    this.router.put("/update/:userName", Authorize(LevelTwo), this.updateUser.bind(this))

    /**
     * @swagger
     * /users/ms-adm-update-password:
     *  put:
     *   tags:
     *     - Users
     *   summary: API to update user password by SUPER_ADMIN
     *   description: can update user password only if logged in with valid SUPER_ADMIN credentials
     *   requestBody:
     *      content:
     *        application/json:
     *          schema:
     *              $ref: '#/components/schemas/ms_adm_update_pass'
     *   responses:
     *       200:
     *          description: Success
     *       404:
     *          description: User not found
     *       401:
     *          description: Unauthorized
     *       400:
     *          description: Invalid Update
     */
    this.router.put("/ms-adm-update-password", Authorize(LevelThere), this.changeUserPasswordMaster.bind(this))
  }


  /**
   * Controller to handle API requests for creating new user
   * 
   * @route POST /users/new
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body against newUserSchema
      const validNewUser: NewUserDTO = await JoiValidator(newUserSchema, req.body, { abortEarly: false, stripUnknown: true });

      // Call userService.createUser() method to create new user
      const createdUser: UserDTO = await this.userService.createUser(validNewUser);

      // Send response with code 201 and createdUser to client
      res.status(201).json(createdUser);

    } catch (error) {
      // Pass error to next() function in chain, probably an error-handler or logger
      next(error)
    }
  }


  /**
  * Controller method for handling GET requests to retrieve all users
  * 
  * @route GET /users
  * 
  * @returns {PageDTO} - Page of users
  * @param {Request} req - The HTTP request object
  * @param {Response} res - The HTTP response object
  * @param {NextFunction} next - The function to call to pass the request to the next middleware function
  */
  private async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate the request query parameters using Joi
      const queryDTO: FindAllUsersQueryDTO = await JoiValidator(findAllUserQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

      // Retrieve the users from the UserService
      const users: PageDTO = await this.userService.getAllUsers(queryDTO);

      // Send the retrieved users as a JSON response
      res.status(HttpCodes.OK).json(users);

    } catch (error) {
      // Pass any caught errors to the error handling middleware
      next(error);
    }
  }


  /**
   * Controller method for getting a user by ID
   *
   * @route GET /users/id/:id
   * 
   * @param {Request} req - The incoming request object
   * @param {Response} res - The outgoing response object
   * @param {NextFunction} next - The next middleware function in the chain
   * @returns {Promise<void>} - Returns a Promise that resolves to void
   */
  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate that the userId is a valid MongoDB ObjectId
      const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, { abortEarly: false, stripUnknown: true });

      // Call the userService to get the user with the specified id
      const userDTO: UserDTO = await this.userService.getUserById(validId);

      // Respond with a 200 OK status code and the userDTO as JSON
      res.status(HttpCodes.OK).json(userDTO)

    } catch (error) {
      // Catch any errors that occur and pass them to the next middleware function in the chain (e.g. error-handler or logger)
      next(error)
    }
  }


  /**
   * Controller to handle API requests for getting user by username
   * 
   * @route GET /users/:userName
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async getUserByUserName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate username
      const validUserName = await JoiValidator(userNameSchema, req?.params?.userName, { abortEarly: false, stripUnknown: true });

      // ask userService.getUserByUserName() method to return user for given username 
      const userDTO: UserDTO = await this.userService.getUserByUserName(validUserName);

      // respond with code 200 and userDTO to client 
      res.status(HttpCodes.OK).json(userDTO);

    } catch (error) {
      // catch any errors that may occur during the process

      // pass error to next() function in chain, probably an error-handler or logger
      next(error)
    }
  }


  /**
   * Controller to handle API requests for getting user by email
   * 
   * @route GET /users/email/:email
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      // Validate email using Joi
      const validEmail = await JoiValidator(emailSchema, req?.params?.email, { abortEarly: false, stripUnknown: true });

      // Get user data from UserService based on email
      const userDTO: UserDTO = await this.userService.getUserByEmail(validEmail);

      // Send response with user data
      res.status(HttpCodes.OK).json(userDTO)
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error)
    }
  }

  /**
   * Controller to handle API requests for getting account status by username / email
   * 
   * @route GET /users/account-status/:idtype/:id
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async getUserAccountStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let id;
      let userDTO: UserDTO;
      switch (req?.params?.idtype) {
        case "userName":
          // validate username
          id = await JoiValidator(userNameSchema, req?.params?.id, { abortEarly: false, stripUnknown: true });
          // ask userService.getUserByUserName() method to return user for given username 
          userDTO = await this.userService.getUserByUserName(id);
          // respond with code 200 and userDTO to client 
          res.status(HttpCodes.OK).json({ userName: userDTO.userName, status: userDTO.status });
          break;
        case "email":
          // validate username
          id = await JoiValidator(emailSchema, req?.params?.id, { abortEarly: false, stripUnknown: true });
          // ask userService.getUserByEmail() method to return user for given email 
          userDTO = await this.userService.getUserByEmail(id);
          // respond with code 200 and userDTO to client 
          res.status(HttpCodes.OK).json({ userName: userDTO.userName, status: userDTO.status });
          break;
        default:
          throw new UserException(
            `Invalid Id Type: ${req.params?.idtype}`,
            HttpCodes.BAD_REQUEST,
            `Provided Id Type is Invalid: ${req.params?.idtype}`,
            "@UserController.class: getUserAccountStatus.controller()"
          );
      }
    } catch (error) {
      // catch any errors that may occur during the process

      // pass error to next() function in chain, probably an error-handler or logger
      next(error)
    }
  }

  /**
   * Controller to handle API requests for updateing user
   * updateUser ( role, status only)
   * 
   * @route PUT /users/update/:userName
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate userName parameter
      const validUserName = await JoiValidator(userNameSchema, req?.params?.userName, { abortEarly: false, stripUnknown: true });

      // Validate user update body
      const validUserUpdateBody = await JoiValidator(userUpdateSchema, req?.body, { abortEarly: false, stripUnknown: true });

      // Create user update DTO with additional metadata
      const userUpdateDTO: UpdateUserDTO = {
        ...validUserUpdateBody,
        last_modified_by: "dev"
      }

      // Update user by userName and return updated user DTO
      const userDTO: UserDTO = await this.userService.updateUserByUserName(validUserName, userUpdateDTO);

      // Send HTTP response with updated user DTO
      res.status(200).json(userDTO)
    } catch (error) {
      // Pass any errors to the next middleware function in the request-response cycle
      next(error)
    }
  }

  /**
   * Controller to handle API request for updating user password by admin
   * 
   * @route PUT /users/ms-adm-update-password
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
  private async changeUserPasswordMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req?.userName !== Config.SUPER_ADMIN) {
        throw new UserException(
          "Probably your trying to hack we have noted your identity !",
          HttpCodes.UNAUTHORIZED,
          `userName: ${req?.userName}, is not a SUPER_ADMIN`,
          `@UserController.class: changeUserPasswordMaster.method()`);
      }
      // Validate request body
      const validRequestBody = await JoiValidator(msAdmUpdatePassSchema, req?.body, { abortEarly: false, stripUnknown: true });

      // Update user password and retrun success message with userName
      const updateUser: UserDTO = await this.userService.changeUserPassword(validRequestBody?.userName, validRequestBody?.password);

      // Send HTTP response with updated user DTO
      res.status(200).json({
        userName: updateUser?.userName,
        message: "Password updated successfully."
      })
    } catch (error) {
      // Pass any errors to the next middleware function in the request-response cycle
      next(error)
    }
  }

}

export default UserController;