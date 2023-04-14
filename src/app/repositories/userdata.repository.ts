import IUserData from "@models/interfaces/user.data.interface";
import UserDataModel from "@models/user.data.model";
import mongoose, { Model, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import IUserDataRepository from "./interfaces/userdata.repository.interface";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * UserDataRepository
 * A class that handles CRUD operations for userData documents
 */
@Service()
class UserDataRepository implements IUserDataRepository {
    // The Mongoose model for the UserData documents
    private userDataModel: Model<IUserData>;

    /**
     * Creates a new instance of the UserDataRepository class.
     * Initializes the userDataModel property with the UserDataModel.
     */
    constructor() {
        this.userDataModel = UserDataModel;
    }

    /**
     * create() - creates a new user data document
     * @param userData - the data to create the document
     * @returns the created user data document
     * @throws a RepositoryException if an error occurs
     */
    async create(userData: Partial<IUserData>): Promise<IUserData> {
        try {
            const newUserdata: IUserData = await this.userDataModel.create<Partial<IUserData>>(userData);

            // If the user data object could not be created, throw an exception
            if (!newUserdata) {
                throw new RepositoryException(
                    `Unable to initialize new userData`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `Error while initializing userdata`,
                    `UserDataRepository.class: create.method()`
                );
            }

            return newUserdata;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${error?.stack}`,
                    `UserDataRepository.class: create.method()`
                );
            }
        }
    }


    /**
     * findByUserId() - finds a user data document by user ID
     * @param userId - the ID of the user
     * @returns the found user data document or null if not found
     * @throws a RepositoryException if an error occurs
     */
    async findByUserId(userId: mongoose.Types.ObjectId): Promise<IUserData | null> {
        try {
            const userData = await this.userDataModel
                .findOne({ userId }, { __v: 0 })
                .exec();

            return userData;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${error?.stack}`,
                    `UserDataRepository.class: findByUserId.method()`
                );
            }
        }
    }


    /**
     * updateUserData() -  Updates an existing user data document for the specified user ID
     * @param userId - the ID of the user
     * @param update - the update query to apply to the document
     * @returns true if the document was updated, false otherwise
     * @throws a RepositoryException if an error occurs
     */
    async updateUserData(userId: mongoose.Types.ObjectId, update: UpdateQuery<IUserData>): Promise<boolean> {
        try {
            const result = await this.userDataModel.findOneAndUpdate({ userId: userId }, update, { new: true }).exec();

            // If the update was successful, return true
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${error?.stack}`,
                    `UserDataRepository.class: updateUserData.method()`
                );
            }
        }
    }

    /**
     * findAll() - Retrieves all user data documents and their associated user information
     * @returns an array of user data documents
     * @throws a RepositoryException if an error occurs
     */
    async findAll(): Promise<IUserData[]> {
        try {
            // Find all user data objects and populate them with associated user information
            const userData = await this.userDataModel.find({}, { __v: 0 }).populate({
                path: 'userId',
                model: 'user',
                localField: 'userId',
                foreignField: '_id',
                select: "userName email status role createdAt",
            }).exec();

            return userData;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${error?.stack}`,
                    `UserDataRepository.class: findAll.method()`
                );
            }
        }
    }
}

export default UserDataRepository;