import { UserDTO } from "@dto/user.dto";
import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { findAllUserQuerySchema } from "@joiSchemas/user.joi.schemas";
import { UserService } from "@service/user.service";
import JoiValidator from "@utils/joi.validator";
import debugLogger from "debug";
import { NextFunction, Request, Response, Router } from "express";

import { Inject, Service } from "typedi";

function custMiddleWare(req: Request, res: Response, next: NextFunction) {
  console.log(req.baseUrl);
  req.message = "hello world";
  next()
}

@Service()
export class UserController {
  private debug = debugLogger("moviebunkers:[UserController.class]");

  public router = Router();
  private userService: UserService;
  constructor(@Inject() userService: UserService) {
    this.userService = userService;

    // get
    this.router.get("/", custMiddleWare, this.getAllUsers.bind(this));
    this.router.get("/id/:id", custMiddleWare, this.getUserById.bind(this));
    this.router.get("/:userName", custMiddleWare, this.getUserByUserName.bind(this));
    this.router.get("/email/:email", custMiddleWare, this.getUserByEmail.bind(this));


    //post
    this.router.post("/new", custMiddleWare, this.createUser.bind(this));

    //put
    this.router.put("/update/:userName", custMiddleWare, this.updateUser.bind(this))

  }

  /**
   * getAll users unimplemented
   * @param req 
   * @param res 
   * @param next 
   */
  private async getAllUsers(req: Request, res: Response, next: NextFunction) {

    try {

      // const queryDTO = await JoiValidator(findAllUserQuerySchema, req.query, { abortEarly: false, stripUnknown: true });

      // throw new MoviebunkersException('testing exception', HttpCodes.NOT_FOUND)
      res.status(200).json({ message: "getAllUsers - unimplemented" });

    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  /**
   * getUserById controller
   * @param req 
   * @param res 
   * @param next 
   */
  private async getUserById(req: Request, res: Response, next: NextFunction) {
    try {

      const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, { abortEarly: false, stripUnknown: true })
      // const userDTO: UserDTO
      res.status(200).json({ message: 'getUserById' })
    } catch (error) {
      next(error)
    }
  }

  private async getUserByUserName(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "getUserByUserName" })
    } catch (error) {
      next(error)
    }
  }

  private async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "getUserByEmail" })
    } catch (error) {
      next(error)
    }
  }

  private async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ message: "createUser" })
    } catch (error) {
      next(error)
    }
  }

  private async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ message: "updateUser" })
    } catch (error) {
      next(error)
    }
  }

}
