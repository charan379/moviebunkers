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
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * The `UserService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting links.
 */
@Service()
export class UserService implements IUserService {
  /**
   * User repository dependency injection.
   */
  private userRepository: UserRepository;

  /**
   * Constructor to initialize the UserService instance.
   * @param userRepository An instance of UserRepository to be injected into the service.
   */
  constructor(@Inject() userRepository: UserRepository) {
    this.userRepository = userRepository;
  }


  /**
     * Creates a new user.
     * @param {NewUserDTO} newUserDTO - An object containing the new user's information.
     * @returns {Promise<UserDTO>} - A Promise that resolves to the newly created user's information.
     * @throws {UserException} - Throws an exception if the user name or email already exists, or if user creation fails.
     */
  async createUser(newUserDTO: NewUserDTO): Promise<UserDTO> {
    try {
      // Check if user name already exists.
      const userNameAlreadyExists = await this.userRepository.findByUserName(newUserDTO.userName);
      if (userNameAlreadyExists) {
        throw new UserException("User Name already exits", HttpCodes.BAD_REQUEST, `UserName: ${newUserDTO.userName} is already taken`);
      }

      // Check if email already exists.
      const emailAlreadyExits = await this.userRepository.findByEmail(newUserDTO.email);
      if (emailAlreadyExits) {
        throw new UserException("Email already exits", HttpCodes.BAD_REQUEST, `Email: ${newUserDTO.email} is already taken`);
      }

      // Hash the user's password.
      const hashedPassword = await generateHash(newUserDTO.password);

      // Create a new user DTO with the hashed password.
      const newUserDTOWithHashedPassword = { ...newUserDTO, password: hashedPassword };

      // Create the new user.
      const user = await this.userRepository.create(newUserDTOWithHashedPassword);

      // Throw an exception if user creation failed.
      if (!user) {
        throw new UserException("User creation failed", HttpCodes.INTERNAL_SERVER_ERROR, `Unknown Reason contact developer`);
      }

      // Create a user DTO with the user's information.
      const userDTO = {
        userName: user.userName,
        email: user.email,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Return the newly created user DTO.
      return userDTO;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }


  /**
     * Gets a user by ID.
     * @param {string} id - The ID of the user to get.
     * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
     * @throws {UserException} - Throws an exception if the user is not found.
     */
  async getUserById(id: string): Promise<UserDTO> {
    try {
      // Get the user by ID.
      const user = await this.userRepository.findById(id);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException("User not found", HttpCodes.NOT_FOUND, `User not found for ID: ${id}`);
      }

      // Create a user DTO with the user's information.
      const userDTO: UserDTO = user;

      // Return the user DTO.
      return userDTO;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }

  /**
   * Retrieves a user by their username.
   * @param {string} userName - The username of the user to retrieve.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async getUserByUserName(userName: string): Promise<UserDTO> {
    try {
      // Get the user from the repository by their username.
      const user = await this.userRepository.findByUserName(userName);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.NOT_FOUND,
          `User not found for username: ${userName}`,
          "@UserService.class: getUserByUserName method"
        );
      }

      // Create a DTO with the user's information.
      const userDTO: UserDTO = user;

      // Return the user DTO.
      return userDTO;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }


  /**
   * Retrieves a user by their email.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async getUserByEmail(email: string): Promise<UserDTO> {
    try {
      // Get the user from the repository by their email.
      const user = await this.userRepository.findByEmail(email);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.NOT_FOUND,
          `User not found for email: ${email}`,
          "@UserService.class: getUserByEmail.method()"
        );
      }

      // Create a DTO with the user's information.
      const userDTO: UserDTO = {
        userName: user.userName,
        email: user.email,
        status: user.status,
        role: user.role,
        last_modified_by: user?.last_modified_by,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Return the user DTO.
      return userDTO;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }



  /**
 * Retrieves a page of users that match the provided query parameters.
 * @param {FindAllUsersQueryDTO} queryDTO - The query parameters used to filter and sort the users.
 * @returns {Promise<PageDTO>} - A Promise that resolves to a page of user information.
 * @throws {UserException} - Throws an exception if an unexpected error occurs.
 */
  async getAllUsers(queryDTO: FindAllUsersQueryDTO): Promise<PageDTO> {
    try {
      // Build the filter query using the provided query parameters.
      const query: FilterQuery<IUser> = {
        $and: [
          {
            userName: { $regex: new RegExp(`^${queryDTO?.userName ?? ""}`, "i") },
            email: { $regex: new RegExp(`^${queryDTO?.email ?? ""}`, "i") },
            role: { $regex: new RegExp(`^${queryDTO?.role ?? ""}`, "i") },
            status: { $regex: new RegExp(`^${queryDTO.status ?? ""}`, "i") },
          },
        ],
      };

      // Build the findAll query object using the filter query, sort options, and pagination parameters.
      const sort = queryDTO.sort_by ? await MongoSortBuilder(queryDTO.sort_by) : { createdAt: "desc" };
      const q: FindAllQuery = {
        query,
        sort,
        limit: queryDTO?.limit ?? 5,
        page: queryDTO?.page ?? 1,
      };

      // Retrieve a page of users information using the findAll query.
      const page: PageDTO = await this.userRepository.findAll(q);

      // Return the page of users information.
      return page;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }



  /**
   * Updates a user's role and/or status by their username.
   * @param {string} userName - The username of the user to update.
   * @param {UpdateUserDTO} userUpdateDTO - An object containing the fields to update on the user.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the updated user's information.
   * @throws {UserException} - Throws an exception if the user is not found or if the update fails.
   */
  async updateUserByUserName(userName: string, userUpdateDTO: UpdateUserDTO): Promise<UserDTO> {
    try {
      // Get the user from the repository by their username.
      const user = await this.userRepository.findByUserName(userName);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.NOT_FOUND,
          `User not found for username: ${userName}`,
          "@UserService.class: updateUserByUserName method"
        );
      }

      // Update the user's role and/or status.
      const updatedUser = await this.userRepository.update(user.userName, userUpdateDTO);

      // Throw an exception if the update fails.
      if (!updatedUser) {
        throw new UserException(
          "User update failed",
          HttpCodes.INTERNAL_SERVER_ERROR,
          "Unknown reason - contact developer",
          `@UserService.class: updateUserByUserName method - username: ${userName}, user: ${JSON.stringify(user)}, updateDTO: ${JSON.stringify(userUpdateDTO)}`
        );
      }

      // Create a DTO with the updated user's information.
      const userDTO: UserDTO = {
        userName: updatedUser.userName,
        email: updatedUser.email,
        status: updatedUser.status,
        role: updatedUser.role,
        last_modified_by: updatedUser?.last_modified_by,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      // Return the updated user DTO.
      return userDTO;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof UserException) {
        throw error;
      } else {
        throw new UserException("Unexpected error occurred", HttpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }

}
