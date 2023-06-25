import IUser from "@models/interfaces/user.interface";
import { generateHash } from "@utils/bcrypt";
import MongoSortBuilder from "@utils/mongo.sort.builder";
import { FilterQuery } from "mongoose";
import { Inject, Service } from "typedi";
import HttpCodes from "../constants/http.codes.enum";
import { FindAllUsersQueryDTO, NewUserDTO, UpdateUserDTO, UserDTO, iuserToUserDTOMapper } from "../dto/user.dto";
import UserException from "../exceptions/user.exception";
import UserRepository from "../repositories/user.repository";
import IUserService from "./interfaces/user.service.interface";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import { FindAllQuery, OTP, Page } from "src/@types";
import generateOTP from "@utils/generateOTP";
import OTPtype from "@constants/otpType.enum";
import addHoursToDate from "@utils/addHoursToDate";
import UserStatus from "@constants/user.status.enum";

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
      const userNameAlreadyExists: IUser | null = await this.userRepository.findByUserName(newUserDTO.userName);
      if (userNameAlreadyExists) {
        throw new UserException(
          "User Name already exits",
          HttpCodes.BAD_REQUEST,
          `UserName: ${newUserDTO.userName} is already taken`,
          `@UserService.class: createUser.method()`);
      }

      // Check if email already exists.
      const emailAlreadyExits: IUser | null = await this.userRepository.findByEmail(newUserDTO.email);
      if (emailAlreadyExits) {
        throw new UserException(
          "Email already exits",
          HttpCodes.BAD_REQUEST,
          `Email: ${newUserDTO.email} is already taken`,
          `@UserService.class: createUser.method()`);

      }

      // Hash the user's password.
      const hashedPassword: string = await generateHash(newUserDTO.password);
      // Generate Verification OTP
      const otp: OTP = {
        code: generateOTP(8, OTPtype.ALPHA_NUMERIC_CASE_UP),
        expiryDate: addHoursToDate(new Date(), 12)
      }
      // Create a new user DTO with the hashed password and OTP.
      const newUserDTOWithHashedPasswordAndOtp = { ...newUserDTO, password: hashedPassword, otp };

      // Create the new user.
      const user: IUser | null = await this.userRepository.create(newUserDTOWithHashedPasswordAndOtp);

      // Throw an exception if user creation failed.
      if (!user) {
        throw new UserException(
          "User creation failed",
          HttpCodes.CONFLICT,
          `Unknown Reason contact developer`,
          `@UserService.class: createUser.method()`);
      }

      // Return the newly created user DTO.
      return iuserToUserDTOMapper(user);

    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          `@UserService.class: createUser.method()`);
      }
    }
  }

  /**
   * Update user password with userName and new password.
   * @param {string} userName - userName of the user to be update.
   * @param {string} newPassword - New password of the user to be updated with.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async changeUserPassword(userName: string, newPassword: string): Promise<UserDTO> {

    try {
      // Hash the user's password.
      const newHashedPassword: string = await generateHash(newPassword);
      // update with password
      const update: Partial<IUser> = { password: newHashedPassword };
      const updatedUser: IUser | null = await this.userRepository.update(userName, update);

      if (!updatedUser) {
        throw new UserException(
          "User Password Updation Failed",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, got null from userRepository.update()`,
          `@UserService.class: changeUserPassword.method()`);
      }

      return iuserToUserDTOMapper(updatedUser, { withPassword: false });
    } catch (error) {
      throw error
    }
  }

  /**
   * Update user OTP with userName.
   * @param {string} userName - userName of the user to be update.
   * @param {string} otpType - Type of otp to be generated.
 * @returns {Promise<UserDTO>} - A Promise that resolves to UserDTO.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async generateUserOtp(userName: string, otpType: OTPtype): Promise<UserDTO> {

    try {
      //  check if user exits
      const userDto: UserDTO = await this.getUserByUserName(userName);

      // if previous OTP not yet expired
      if (Date.now() < new Date(userDto?.otp?.expiryDate).getTime()) {
        throw new UserException(
          "OTP Already Sent",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, OTP which is sent previously is not yet utilized !`,
          `@UserService.class: generateUserOtp.method()`);
      }
      // Generate Verification OTP
      const otp: OTP = {
        code: generateOTP(8, otpType),
        expiryDate: addHoursToDate(new Date(), 12)
      }

      const update: Partial<IUser> = { otp };
      const updatedUser: IUser | null = await this.userRepository.update(userName, update);

      if (!updatedUser) {
        throw new UserException(
          "Failed update user OTP",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, got null from userRepository.update()`,
          `@UserService.class: generateUserOtp.method()`);
      }

      return iuserToUserDTOMapper(updatedUser);
    } catch (error) {
      throw error
    }
  }

  /**
 * Scrap user OTP with userName.
 * @param {string} userName - userName of the user to be update.
 * @returns {Promise<boolean>} - A Promise that resolves to true/false.
 * @throws {UserException} - Throws an exception if the user is not found.
 */
  async scrapUserOtp(userName: string): Promise<boolean> {

    try {
      // Generate Verification OTP
      const otp: OTP = {
        code: "0",
        expiryDate: new Date()
      }

      const update: Partial<IUser> = { otp };
      const updatedUser: IUser | null = await this.userRepository.update(userName, update);

      if (!updatedUser) {
        throw new UserException(
          "Failed scrap user OTP",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, got null from userRepository.update()`,
          `@UserService.class: generateUserOtp.method()`);
      }

      return true;
    } catch (error) {
      throw error
    }
  }


  /**
   * Update user password with userName and new password.
   * @param {string} userName - userName of the user to be update.
   * @param {string} newPassword - New password of the user to be updated with.
   * @param {string} otp - otp to verify user identity.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async restUserPassword(userName: string, newPassword: string, otp: string): Promise<UserDTO> {

    try {
      const user: UserDTO = await this.getUserByUserName(userName);

      if (user?.otp?.code === "0" || !user?.otp?.code) {
        throw new UserException(
          "Incorrect OTP",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is incorrect, User OTP is not generated.`,
          `@UserService.class: restUserPassword.method()`);
      }

      if (Date.now() > new Date(user?.otp?.expiryDate).getTime()) {
        throw new UserException(
          "OTP Expired",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is expired`,
          `@UserService.class: restUserPassword.method()`);
      }

      if (user?.otp?.code !== otp) {
        throw new UserException(
          "Incorrect OTP",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is incorrect.`,
          `@UserService.class: restUserPassword.method()`);
      }

      // scrap user otp since its already used
      await this.scrapUserOtp(userName);

      // Hash the user's password.
      const newHashedPassword: string = await generateHash(newPassword);
      // update with password
      const update: Partial<IUser> = { password: newHashedPassword };
      const updatedUser: IUser | null = await this.userRepository.update(userName, update);

      if (!updatedUser) {
        throw new UserException(
          "User Password Updation Failed",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, got null from userRepository.update()`,
          `@UserService.class: restUserPassword.method()`);
      }

      return iuserToUserDTOMapper(updatedUser, { withPassword: false });
    } catch (error) {
      throw error
    }
  }

  /**
   * Update user password with userName and new password.
   * @param {string} userName - userName of the user to be update.
   * @param {string} otp - otp to verify user identity.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async completeUserEmailVerification(userName: string, otp: string,): Promise<UserDTO> {

    try {
      const user: UserDTO = await this.getUserByUserName(userName);

      if (user?.otp?.code === "0" || !user?.otp?.code) {
        throw new UserException(
          "Incorrect OTP",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is incorrect, User OTP is not generated.`,
          `@UserService.class: completeUserEmailVerification.method()`);
      }

      if (Date.now() > new Date(user?.otp?.expiryDate).getTime()) {
        throw new UserException(
          "OTP Expired",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is expired`,
          `@UserService.class: completeUserEmailVerification.method()`);
      }

      if (user?.otp?.code !== otp) {
        throw new UserException(
          "Incorrect OTP",
          HttpCodes.BAD_REQUEST,
          `OTP: ${otp}, is incorrect`,
          `@UserService.class: completeUserEmailVerification.method()`);
      }

      if (user?.emailVerified) {
        throw new UserException(
          "Email already verified",
          HttpCodes.BAD_REQUEST,
          `Duplicate Request`,
          `@UserService.class: completeUserEmailVerification.method()`);
      }

      // scrap user otp since its already used
      await this.scrapUserOtp(userName);

      // update user status
      const update: Partial<IUser> = { emailVerified: true, status: UserStatus.ACTIVE };
      const updatedUser: IUser | null = await this.userRepository.update(userName, update);

      if (!updatedUser) {
        throw new UserException(
          "User verification Failed",
          HttpCodes.BAD_REQUEST,
          `userName: ${userName}, got null from userRepository.update()`,
          `@UserService.class: completeUserEmailVerification.method()`);
      }

      return iuserToUserDTOMapper(updatedUser, { withPassword: false });
    } catch (error) {
      throw error
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
      const user: IUser | null = await this.userRepository.findById(id);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.BAD_REQUEST,
          `User not found for ID: ${id}`,
          `@UserService.class: getUserById.method()`);
      }

      // Return the user DTO.
      return iuserToUserDTOMapper(user);

    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          `@UserService.class: getUserById.method()`);
      }
    }
  }

  /**
   * Retrieves a user by their username.
   * @param {string} userName - The username of the user to retrieve.
   * @param {boolean} withPassword - The option whether to retrive user with password or not.
   * @returns {Promise<UserDTO>} - A Promise that resolves to the user's information.
   * @throws {UserException} - Throws an exception if the user is not found.
   */
  async getUserByUserName(userName: string, withPassword: boolean = false): Promise<UserDTO> {
    try {
      // Get the user from the repository by their username.
      const user: IUser | null = await this.userRepository.findByUserName(userName);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.BAD_REQUEST,
          `User not found for username: ${userName}`,
          "@UserService.class: getUserByUserName.method()"
        );
      }

      // Return the user DTO.
      return iuserToUserDTOMapper(user, { withPassword });

    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          "@UserService.class: getUserByUserName.method()");
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
      const user: IUser | null = await this.userRepository.findByEmail(email);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.NOT_FOUND,
          `User not found for email: ${email}`,
          "@UserService.class: getUserByEmail.method()"
        );
      }

      // Return the user DTO.
      return iuserToUserDTOMapper(user);
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          "@UserService.class: getUserByEmail.method()");
      }
    }
  }



  /**
 * Retrieves a page of users that match the provided query parameters.
 * @param {FindAllUsersQueryDTO} queryDTO - The query parameters used to filter and sort the users.
 * @returns {Promise<PageDTO>} - A Promise that resolves to a page of user information.
 * @throws {UserException} - Throws an exception if an unexpected error occurs.
 */
  async getAllUsers(queryDTO: FindAllUsersQueryDTO): Promise<Page<UserDTO>> {
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
      const q: FindAllQuery<IUser> = {
        query,
        sort,
        limit: queryDTO?.limit ?? 5,
        page: queryDTO?.page ?? 1,
      };

      // Retrieve a page of users information using the findAll query.
      const page: Page<UserDTO> = await this.userRepository.findAll(q);

      // Return the page of users information.
      return page;
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof MoviebunkersException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          "@UserService.class: getAllUsers.method()");
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
      const user: IUser | null = await this.userRepository.findByUserName(userName);

      // Throw an exception if the user is not found.
      if (!user) {
        throw new UserException(
          "User not found",
          HttpCodes.NOT_FOUND,
          `User not found for username: ${userName}`,
          "@UserService.class: updateUserByUserName.method()"
        );
      }

      // Update the user's role and/or status.
      const updatedUser: IUser | null = await this.userRepository.update(user.userName, userUpdateDTO);

      // Throw an exception if the update fails.
      if (!updatedUser) {
        throw new UserException(
          "User update failed",
          HttpCodes.CONFLICT,
          "Unknown reason - contact developer",
          `@UserService.class: updateUserByUserName.method() - username: ${userName}, user: ${JSON.stringify(user)}, updateDTO: ${JSON.stringify(userUpdateDTO)}`
        );
      }

      // Return the updated user DTO.
      return iuserToUserDTOMapper(updatedUser);
    } catch (error: any) {
      // Catch any exceptions thrown and rethrow them as UserExceptions.
      if (error instanceof UserException) {
        throw error;
      } else {
        throw new UserException(
          "Unexpected error occurred",
          HttpCodes.INTERNAL_SERVER_ERROR,
          error.message,
          `@UserService.class: updateUserByUserName.method()`);
      }
    }
  }

}
