import { FindAllUsersQueryDTO, NewUserDTO } from "@src/app/dto/user.dto";
import { ObjectId } from "@src/app/joiSchemas/common.joi.schemas";
import { findAllUserQuerySchema, userRegistrationSchema } from "@src/app/joiSchemas/user.joi.schemas";
import { UserService } from "@src/app/service/user.service";
import JoiValidator from "@src/app/utils/joi.validator.joi";
import debugLogger from "debug";
import { NextFunction, Request, Response } from "express";
import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpError,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { Inject, Service } from "typedi";

function custMiddleWare(req: Request, res: Response, next: NextFunction) {
  const err = new HttpError(401, " this messsage is from custom middle ware");
  next(err);
}

@JsonController("/users")
@Service()
export class UserController {
  private debug = debugLogger("moviebunkers:[UserController.class]");
  private userService: UserService;
  constructor(@Inject() userService: UserService) {
    this.userService = userService;
  }

  @Get("/query*")
  @HttpCode(200)
   async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParams() queryParams: any,
    next: NextFunction) {

    try {
       const queryDTO = await JoiValidator(findAllUserQuerySchema, queryParams, { abortEarly: false, allowUnknown: false, stripUnknown: true });
      return queryDTO;
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  
  @Get("/:id")
  @HttpCode(200)
  async getById(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const validId = await JoiValidator(ObjectId, id, { allowUnknown: false, stripUnknown: true, abortEarly: false })
      return await this.userService.getUserById(validId);
    } catch (error) {
      this.debug(error);
      throw error;
    }
  }

  @Post("/create")
  @HttpCode(201)
  @UseBefore(custMiddleWare)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: Object,
    next: NextFunction
  ) {
    try {
      const newUserDTO: NewUserDTO = await JoiValidator(
        userRegistrationSchema,
        body,
        { allowUnknown: false, stripUnknown: true, abortEarly: false }
      );

      this.debug(newUserDTO);
      return { newUserDTO };
    } catch (error) {
      throw error;
    }
  }

  @Delete("/delete/:userName")
  delete(
    @Param("userName") user: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    this.debug("delete user working");
    return { user };
  }

  @Put("/update/:userName")
  update(
    @Body() updateBody: any,
    @Param("userName") user: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    this.debug("update user working");
    return { user, updateBody };
  }
}
