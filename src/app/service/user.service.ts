import PageDTO from "@dto/page.dto";
import IUser from "@models/interfaces/user.interface";
import { FindAllQuery } from "@repositories/interfaces/custom.types.interfaces";
import { generateHash } from "@utils/bcrypt";
import MongoSortBuilder from "@utils/mongo.sort.builder";
import { FilterQuery } from "mongoose";
import { Inject, Service } from "typedi";
import HttpCodes from "../constants/http.codes.enum";
import { FindAllUsersQueryDTO, NewUserDTO, UpdateUserDTO, UserDTO } from "../dto/user.dto";
import UserException from "../exceptions/user.exception";
import UserRepository from "../repositories/user.repository";
import IUserService from "./interfaces/user.service.interface";

@Service()
export class UserService implements IUserService {
  /**
   * userRepository
   */
  private userRepository: UserRepository;

  /**
   *
   * @param userRepository inject user repository
   */
  constructor(@Inject() userRepository: UserRepository) {

    this.userRepository = userRepository;
  }


  /**
   * createUser()
   * @param newUserDTO 
   * @returns 
   */
  async createUser(newUserDTO: NewUserDTO): Promise<UserDTO> {

    const userNameAlreadyExists = await this.userRepository.findByUserName(newUserDTO.userName);

    if (userNameAlreadyExists) throw new UserException("User Name already exits", HttpCodes.OK, `UserName: ${newUserDTO.userName} is already taken`);

    const emailAlreadyExits = await this.userRepository.findByEmail(newUserDTO.email);

    if (emailAlreadyExits) throw new UserException("Email already exits", HttpCodes.OK, `Email: ${newUserDTO.email} is already taken`);

    const hashedPassword: string = await generateHash(newUserDTO.password);

    const newUserDTOWithHashedPassword: NewUserDTO = { ...newUserDTO, password: hashedPassword };

    const user = await this.userRepository.create(newUserDTOWithHashedPassword);

    if (!user) throw new UserException("User creation faield", HttpCodes.INTERNAL_SERVER_ERROR, `Unknown Reason contact developer`)

    const userDTO: UserDTO = {
      userName: user.userName,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return userDTO;
  }

  /**
   * getUserById()
   * @param id
   * @returns UserDTO
   */
  async getUserById(id: string): Promise<UserDTO> {

    const user = await this.userRepository.findById(id);

    if (!user) throw new UserException("User Not Found", HttpCodes.NOT_FOUND, `User not found for given id : ${id}`, `@UserService.class: @getUserById.method() userId : ${id}`);

    const userDTO: UserDTO = {
      userName: user.userName,
      email: user.email,
      status: user.status,
      role: user.role,
      last_modified_by: user?.last_modified_by,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userDTO;
  }

  /**
   * getUserByUserName(0)
   * @param userName 
   * @returns UserDTO
   */
  async getUserByUserName(userName: string): Promise<UserDTO> {

    const user = await this.userRepository.findByUserName(userName);

    if (!user) throw new UserException("User Not Found", HttpCodes.NOT_FOUND, `user not found for given userName : ${userName}`,`@UserService.class: @getUserByUserName.method() userName : ${userName}`);

    const userDTO: UserDTO = {
      userName: user.userName,
      password: user.password,
      email: user.email,
      status: user.status,
      role: user.role,
      last_modified_by: user?.last_modified_by,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userDTO;
  }

  /**
   * getUserByEmail()
   * @param email 
   * @returns UserDTO
   */
  async getUserByEmail(email: string): Promise<UserDTO> {

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserException("User Not Found", HttpCodes.NOT_FOUND, `user not found for given email : ${email}`, `@UserService.class: @getUserByEmail.method() email : ${email}`);

    const userDTO: UserDTO = {
      userName: user.userName,
      email: user.email,
      status: user.status,
      role: user.role,
      last_modified_by: user?.last_modified_by,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userDTO;
  }


  async getAllUsers(queryDTO: FindAllUsersQueryDTO): Promise<PageDTO> {

    const query: FilterQuery<IUser> = {
      $and: [
        {
          userName: { $regex: new RegExp(`^${queryDTO?.userName ?? ""}`, "i") },
          email: { $regex: new RegExp(`^${queryDTO?.email ?? ""}`, "i") },
          role: { $regex: new RegExp(`^${queryDTO?.role ?? ""}`, "i") },
          status: { $regex: new RegExp(`^${queryDTO.status ?? ""}`, "i") }
        }
      ]
    }

    const sort = queryDTO.sort_by ? await MongoSortBuilder(queryDTO.sort_by) : { createdAt: 'desc' }
    const q: FindAllQuery = {
      query,
      sort: sort,
      limit: queryDTO?.limit ?? 5,
      page: queryDTO?.page ?? 1,
    }

    const page: PageDTO = await this.userRepository.findAll(q)

    return page;
  }


  /**
   * updateUserByUserName ( role, status only)
   * @param userName 
   * @param userUpdateDTO 
   * @returns 
   */
  async updateUserByUserName(userName: string, userUpdateDTO: UpdateUserDTO): Promise<UserDTO> {

    const user = await this.userRepository.findByUserName(userName);

    if (!user) throw new UserException("Update Failed: User Not Found", HttpCodes.NOT_FOUND, `user not found for given userName : ${userName}`, `@UserService.class: @updateUserByUserName.method() userName : ${userName}`)

    const updatedUser = await this.userRepository.update(user.userName, userUpdateDTO);

    if (!updatedUser) throw new UserException("User Updation Failed", HttpCodes.INTERNAL_SERVER_ERROR, "Unknown Reason contact developer", `@UserService.class: @updateUserByUserName.method() userName: ${userName}, user: ${JSON.stringify(user)}, updateDTO: ${userUpdateDTO}`);

    const userDTO: UserDTO = {
      userName: updatedUser.userName,
      email: updatedUser.email,
      status: updatedUser.status,
      role: updatedUser.role,
      last_modified_by: updatedUser?.last_modified_by,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return userDTO;
  }
}
