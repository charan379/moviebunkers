import HttpCodes from "@constants/http.codes.enum";
import UserDataDTO, { iuserDataToUserDataDTOMapper } from "@dto/userdata.dto";
import UserDataException from "@exceptions/userdata.exception";
import IUserData from "@models/interfaces/IUserData";
import UserDataRepository from "@repositories/userdata.repository";
import mongoose, { Types } from "mongoose";
import { Inject, Service } from "typedi";
import IUserDataService from "./interfaces/userdata.service.interface";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * The `UserDataService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting userData.
 */
@Service()
class UserDataService implements IUserDataService {
    /**
     * UserDataRepository repository dependency injection.
     */
    private userDataRepository: UserDataRepository;

    /**
     * Constructor to initialize the UserDataService instance.
     * @param userDataRepository An instance of UserDataRepository to be injected into the service.
     */
    constructor(@Inject() userDataRepository: UserDataRepository) {
        this.userDataRepository = userDataRepository;
    }

    /**
     * Creates a new user data object with the given user id.
     * @param {string} userId - The id of the user for which to create the data object.
     * @returns {Promise<Partial<UserDataDTO>>} A promise that resolves with the newly created user data object.
     * @throws {UserDataException} If there is an error creating the user data object.
     */
    async create(userId: string): Promise<Partial<UserDataDTO>> {
        try {
            // Create a new user data object with the given user id.
            let userData: Partial<IUserData> = {
                userId: new Types.ObjectId(userId)
            };

            // Check if user data already exists for the given user id.
            const existingUserData = await this.userDataRepository.findByUserId(new Types.ObjectId(userId));
            if (existingUserData) {
                // If user data already exists, throw a UserDataException with details about the error.
                throw new UserDataException(
                    "UserData already exists",
                    HttpCodes.BAD_REQUEST,
                    `userId: ${userId.toString()} user_data already initialized for this user`,
                    `UserDataService.class: create.method()`
                );
            }

            // If user data does not already exist, create the new user data object and return it.
            const userDataCreated: IUserData = await this.userDataRepository.create(userData);

            return iuserDataToUserDataDTOMapper(userDataCreated)

        } catch (error: any) {
            // If an error occurs, catch it here and handle it.
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error;
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Unable to initialize user data: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`
                );
            }
        }
    }


    /**
     * Gets the user data for the user with the given userId. If the user data doesn't exist yet, initializes it.
     * @param {ObjectId} userId - The id of the user whose data to get.
     * @returns {Promise<UserDataDTO>} A promise that resolves with the user data object.
     * @throws {UserDataException} If the user data object can't be found or created.
     */
    async getUserData(userId: string): Promise<UserDataDTO> {
        try {
            // Try to find the user data for the given user id.
            let userData = await this.userDataRepository.findByUserId(new Types.ObjectId(userId));

            // If the user data doesn't exist yet, initialize it.
            if (!userData) await this.create(userId);

            // Try to find the user data again, to make sure it exists.
            userData = await this.userDataRepository.findByUserId(new Types.ObjectId(userId));

            // If the user data still doesn't exist, throw an exception.
            if (!userData) throw new UserDataException("UserData not found",
                HttpCodes.BAD_REQUEST,
                `UserData Doc for userId: ${userId.toString()} doesn't exist`,
                `UserDataService.class: getUserData.method()`);

            // Return the user data object.
            return iuserDataToUserDataDTOMapper(userData);
        } catch (error: any) {
            // If an error occurs, catch it here and handle it.
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error;
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to get user data: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR, `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: getUserData.method()`);
            }
        }
    }


    /**
     * addToSeenTitles()
     * Adds the specified title to the list of seen titles for the specified user.
     * If the title is already in the user's unseen titles list, it is removed from that list.
     * @param {string} userId - The ID of the user whose data should be updated
     * @param {string} titleId - The ID of the title to add to the user's seen titles list
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was added to the user's
     * seen titles list, or false if an error occurred and the title was not added
     * @throws {UserDataException} throws UserDataException if any error while adding to seen titles
     */
    async addToSeenTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Get the user's existing data, creating a new record if necessary
            const userDataDto = await this.getUserData(userId);

            // If the title is in the user's unseen titles list, remove it from that list
            if (userDataDto.unseenTitles.includes(titleId)) {
                await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $pull: { unseenTitles: titleId } })
            }

            // Add the title to the user's seen titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $addToSet: { seenTitles: titleId } })

            // Return true if the title was successfully added, false otherwise
            if (result) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to add title ${titleId} to seen titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: addToSeenTitles.method()`
                );
            }
        }
    }


    /**
     * Adds the specified title to the list of unseen titles for the specified user.
     * If the title is already in the user's seen titles list, it is removed from that list.
     * @param {string} userId - The ID of the user whose data should be updated
     * @param {string} titleId - The ID of the title to add to the user's unseen titles list
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was added to the user's
     * unseen titles list, or false if an error occurred and the title was not added
     * @throws {UserDataException} throws UserDataException if any error while adding to unseen titles
     */
    async addToUnSeenTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Get the user's existing data, creating a new record if necessary
            const userDataDto = await this.getUserData(userId);

            // If the title is in the user's seen titles list, remove it from that list
            if (userDataDto.seenTitles.includes(titleId)) {
                await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $pull: { seenTitles: titleId } })
            }

            // Add the title to the user's unseen titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $addToSet: { unseenTitles: titleId } })

            // Return true if the title was successfully added, false otherwise
            if (result) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to add title ${titleId} to unseen titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: addToUnSeenTitles.method()`
                );
            }
        }
    }


    /**
     * addToFavouriteTitles()
     * Adds the specified title to the list of favourite titles for the specified user.
     * @param {string} userId - The ID of the user whose data should be updated
     * @param {string} titleId - The ID of the title to add to the user's favourite titles list
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was added to the user's
     * favourite titles list, or false if an error occurred and the title was not added
     * @throws {UserDataException} throws UserDataException if any error while adding to favourite titles
     */
    async addToFavouriteTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Get the user's existing data, creating a new record if necessary
            const userDataDto = await this.getUserData(userId);

            // Check if the title is already in the user's favourite titles list
            if (userDataDto.favouriteTitles.includes(titleId)) {
                return false;
            }

            // Add the title to the user's favourite titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $addToSet: { favouriteTitles: titleId } })

            // Return true if the title was successfully added, false otherwise
            if (result) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to add title ${titleId} to favourite titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: addToFavouriteTitles.method()`
                );
            }
        }
    }


    /**
     * Removes the specified title from the list of favourite titles for the specified user.
     *
     * @param {string} userId - The ID of the user whose data should be updated.
     * @param {string} titleId - The ID of the title to remove from the user's favourite titles list.
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was removed from the user's
     * favourite titles list, or false if an error occurred and the title was not removed.
     * @throws {UserDataException} throws UserDataException if any error occurs while removing the title from the user's favourite titles list.
     */
    async removeFromFavouriteTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Remove the title from the user's favourite titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $pull: { favouriteTitles: titleId } });

            // Return true if the title was successfully removed, false otherwise
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error;
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to remove title ${titleId} from favourite titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: removeFromFavouriteTitles.method()`
                );
            }
        }
    }


    /**
     * addToStarredTitles()
     * Adds the specified title to the list of starred titles for the specified user.
     * If the title is already in the user's starred titles list, it does not add it again.
     * @param {string} userId - The ID of the user whose data should be updated
     * @param {string} titleId - The ID of the title to add to the user's starred titles list
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was added to the user's
     * starred titles list, or false if an error occurred and the title was not added
     * @throws {UserDataException} throws UserDataException if any error while adding to starred titles
     */
    async addToStarredTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Add the title to the user's starred titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $addToSet: { starredTitles: titleId } })

            // Return true if the title was successfully added, false otherwise
            if (result) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to add title ${titleId} to starred titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: addToStarredTitles.method()`
                );
            }
        }
    }


    /**
     * removeFromStarredTitles()
     * Removes the specified title from the list of starred titles for the specified user.
     * @param {string} userId - The ID of the user whose data should be updated
     * @param {string} titleId - The ID of the title to remove from the user's starred titles list
     * @returns {Promise<boolean>} - A promise that resolves to true if the title was removed from the user's
     * starred titles list, or false if an error occurred and the title was not removed
     * @throws {UserDataException} throws UserDataException if any error while removing from starred titles
     */
    async removeFromStarredTitles(userId: string, titleId: string): Promise<boolean> {
        try {
            // Attempt to remove the specified title from the user's starred titles list
            const result = await this.userDataRepository.updateUserData(new Types.ObjectId(userId), { $pull: { starredTitles: titleId } });

            // Return true if the title was successfully removed, false otherwise
            if (result) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.
                throw new UserDataException(
                    `Failed to remove title ${titleId} from starred titles list: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: removeFromStarredTitles.method()`
                );
            }
        }
    }


    /**
     * getAllUsersData()
     * Retrieves all user data from the user data repository
     * @returns {Promise<UserDataDTO[]>} - A promise that resolves to an array of UserDataDTO objects representing all users
     * @throws {UserDataException} - Throws UserDataException if there was an error retrieving the user data
     */
    async getAllUsersData(): Promise<UserDataDTO[]> {
        try {
            // Call the findAll method of the userDataRepository to retrieve all user data
            const userDataList = await this.userDataRepository.findAll();

            // Return the array of UserDataDTO objects representing all users
            return userDataList.map(userData => iuserDataToUserDataDTOMapper(userData));

        } catch (error: any) {
            // If an error occurs, wrap it in a UserDataException and throw it to the caller
            if (error instanceof MoviebunkersException) {
                // If the error is a MoviebunkersException, re-throw it to the caller.
                throw error;
            } else {
                // If the error is not a MoviebunkersException, wrap it in a UserDataException and throw it to the caller.

                // Create a new UserDataException object with an appropriate error message, HTTP status code,
                // stack trace, and method signature.
                throw new UserDataException(
                    `Failed to retrieve user data: ${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error?.stack)}`,
                    `UserDataService.class: getAllUsersData.method()`
                );
            }
        }
    }

}

export default UserDataService;