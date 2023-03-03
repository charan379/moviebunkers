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
import WinstonLogger from "@middlewares/winstonlogger.middleware";

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

    // get
    this.router.get("/", this.getAllUsers.bind(this));
    this.router.get("/id/:id", this.getUserById.bind(this));
    this.router.get("/:userName", this.getUserByUserName.bind(this));
    this.router.get("/email/:email", this.getUserByEmail.bind(this));


    //post
    this.router.post("/new", this.createUser.bind(this));

    //put
    this.router.put("/update/:userName", this.updateUser.bind(this))

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