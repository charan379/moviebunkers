import { Inject, Service } from "typedi";
import HttpCodes from "../constants/http.codes.enum";
import { UserDTO } from "../dto/user.dto";
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
   * getUserById()
   * @param id
   * @returns UserDTO
   */
  async getUserById(id: string): Promise<UserDTO | null> {

    const user = await this.userRepository.findById(id);

    if (!user) throw new UserException("User not found for given id", HttpCodes.OK, `Id : ${id}`);

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
  async getUserByUserName(userName: string): Promise<UserDTO | null> {

    const user = await this.userRepository.findByUserName(userName);

    if (!user) throw new UserException("User not found for given userName", HttpCodes.OK, `userName : ${userName}`);

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
   * getUserByEmail()
   * @param email 
   * @returns UserDTO
   */
  async getUserByEmail(email: string): Promise<UserDTO | null> {

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserException("User not found for given email", HttpCodes.OK, `email : ${email}`);


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


 async getAllUsers(): Promise<UserDTO[]> {
    throw new Error("Method not implemented.");
  }
  updateUserByUserName(userName: string): Promise<UserDTO> {
    throw new Error("Method not implemented.");
  }
}
