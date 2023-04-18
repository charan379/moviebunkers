import { UserDTO, iuserToUserDTOMapper } from "@dto/user.dto";
import IUserRepository from "@repositories/interfaces/user.repository.interface";
import { Model, ProjectionFields } from "mongoose";
import { Service } from "typedi";
import IUser from "@models/interfaces/user.interface";
import UserModel from "@models/user.model";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";
import { FindAllQuery, Page } from "src/@types";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * Repository class for User model
 */
@Service()
class UserRepository implements IUserRepository {
  /**
   * userModel monggose
   */
  private userModel: Model<IUser>;

  constructor() {
    this.userModel = UserModel;
  }

  /**
   * Creates a new user in the database
   * @param user - Partial user object
   * @returns A promise that resolves to the new user object
   * @throws {RepositoryException} - Throws an exception if there's an error creating the new user in the database
   */
  async create(user: Partial<IUser>): Promise<IUser | null> {
    try {
      // create a new user in the database and return the result
      const newUser: IUser | null = await this.userModel.create<Partial<IUser>>(user);
      // Return the user document if created, otherwise null
      return newUser;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Not able to create new user: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: create.method()`
        );
      }
    }
  }

  /**
   * Finds a user by its ID in the database
   * @param id - User ID
   * @param projection - Fields to be returned in the result
   * @returns A promise that resolves to the user object if found, otherwise null
   * @throws {RepositoryException} - Throws an exception if there's an error finding the user in the database
   */
  async findById(id: string, projection: ProjectionFields<IUser> = { __v: 0, password: 0 }): Promise<IUser | null> {
    try {
      // Use the Mongoose model's `findById()` method to find the user with the given ID
      // `projection` is an optional parameter that specifies the fields to be returned in the result
      // `lean()` is used to return a plain JavaScript object instead of a Mongoose document
      const user: IUser | null = await this.userModel.findById(id, projection).lean().exec();
      // Return the user document if found, otherwise null
      return user;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        // If there's an error, wrap it in a `RepositoryException` with a custom message, HTTP status code, error details, and method name
        throw new RepositoryException(
          `Unable to find user with ID: ${id}, error: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: findById.method()`
        );
      }
    }
  }


  /**
   * Finds a user by its username in the database
   * @param userName - Username of the user
   * @returns A promise that resolves to the user object if found, otherwise null
   * @throws {RepositoryException} If there was an error while executing the query
   */
  async findByUserName(userName: string): Promise<IUser | null> {
    try {
      // Find the user in the database by their username
      // Exclude the __v field from the result
      const user: IUser | null = await this.userModel
        .findOne({ userName: userName }, { __v: 0 })
        .lean()
        .exec();

      // Return the user document if found, otherwise null
      return user;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Not able to complete request: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: findByUserName.method()`
        );
      }
    }
  }


  /**
   * Finds a user by its email address in the database
   * @param email - Email of the user
   * @param projection - Fields to be returned in the result
   * @returns A promise that resolves to the user object if found, otherwise null
   * @throws {RepositoryException} If there was an error while executing the query
   */
  async findByEmail(email: string, projection: ProjectionFields<IUser> = { _id: 0, password: 0, __v: 0 }): Promise<IUser | null> {
    try {
      // Use the findOne method to find a user with a matching email address
      // Use a case-insensitive regular expression to search for the email address
      // Exclude the password and version fields from the result by default
      const user: IUser | null = await this.userModel
        .findOne(
          { email: { $regex: new RegExp(`^${email}$`, "i") } },
          projection
        )
        .lean()
        .exec();
      // Return the user document if found, otherwise null
      return user;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Not able to complete request: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: findByEmail.method()`
        );
      }
    }
  }


  /**
  * Finds all users based on the provided query
  * @param query - The query used to filter users. Can include any properties of the IUser interface.
  * @param sort - The sorting order for the results. Can include any properties of the IUser interface.
  * @param limit - The maximum number of users to return.
  * @param page - The page number to return.
  * @param projection - The fields to be returned in the result. By default, includes all fields except _id, password, and __v.
  * @returns A promise that resolves to a Page object.
  * @throws {RepositoryException} If there was an error while executing the query
  */
  async findAll({ query, sort, limit, page }: FindAllQuery<IUser>, projection: ProjectionFields<IUser> = { _id: 0, password: 0, __v: 0 }): Promise<Page<UserDTO>> {
    try {
      // Get the total number of results based on the query.
      const total_results = await this.userModel
        .find({ ...query })
        .countDocuments();

      // Get a list of users based on the query, sort, limit, and page.
      const usersList = await this.userModel
        .find({ ...query })
        .select(projection)
        .sort({ ...sort })
        .skip((page - 1) * limit)
        .limit(limit);

      // Map the iusers List to UserDTO objects.
      const userDTOs: UserDTO[] = usersList.map((iuser) => (
        iuserToUserDTOMapper(iuser)
      ));

      // Return a Page object with the results.
      const result: Page<UserDTO> = {
        page,
        total_pages: Math.ceil(total_results / limit),
        total_results,
        sort_order: sort,
        list: userDTOs,
      };

      return result;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Unable to complete request: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: findAll.method()`
        );
      }
    }
  }


  /**
   * Updates a user by userName
   * @param userName - User userName
   * @param user - Partial user object
   * @returns A promise that resolves to the updated user object if found and updated, otherwise null
   * @throws {RepositoryException} If there was an error while executing the query
   */
  async update(userName: string, user: Partial<IUser>): Promise<IUser | null> {
    try {
      // Use findByIdAndUpdate to find the user by userName and update its properties
      // $set is used to update only the specified fields in the user object
      const updatedUser: IUser | null = await this.userModel
        .findOneAndUpdate(
          { userName },
          { $set: user },
          {
            // new option returns the updated document instead of the original one
            new: true,
            // runValidators option runs mongoose validators on the update operation
            runValidators: true,
          }
        )
        .lean()
        .exec();

      // Return the user document if updated, otherwise null
      return updatedUser;
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Not able to complete request: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: update.method()`
        );
      }
    }
  }


  /**
   * Deletes a user by ID
   * @param id - User ID
   * @returns A promise that resolves when the user is deleted
   * @throws {RepositoryException} If there was an error while executing the query
   */
  async delete(id: string): Promise<void> {
    try {
      // Find and delete the user with the specified ID
      await this.userModel.findByIdAndDelete(id).lean().exec();
    } catch (error: any) {
      // If the error is a known exception, re-throw it
      if (error instanceof MoviebunkersException) {
        throw error
      } else {
        // Otherwise, wrap the error in a repository exception and re-throw it
        throw new RepositoryException(
          `Not able to complete request: ${error?.message}`,
          HttpCodes.INTERNAL_SERVER_ERROR,
          `${JSON.stringify(error)}`,
          `UserRepository.class: delete.method()`
        );
      }
    }
  }

}

export default UserRepository;
