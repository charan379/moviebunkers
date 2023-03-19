import HttpCodes from "@constants/http.codes.enum";
import UserDataDTO from "@dto/userdata.dto";
import UserDataException from "@exceptions/userdata.exception";
import IUserData from "@models/interfaces/IUserData";
import UserDataRepository from "@repositories/userdata.repository";
import { ObjectId } from "mongoose";
import { Inject, Service } from "typedi";
import IUserDataService from "./interfaces/userdata.service.interface";




@Service()
class UserDataService implements IUserDataService {

    private userDataRepository: UserDataRepository;

    constructor(@Inject() userDataRepository: UserDataRepository) {
        this.userDataRepository = userDataRepository;
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    async create(userId: ObjectId): Promise<Partial<UserDataDTO>> {

        const userData: Partial<IUserData> = {
            userId: userId
        }

        const existingUserData = await this.userDataRepository.findByUserId(userId);

        if (existingUserData) throw new UserDataException("UserData already exits", HttpCodes.BAD_REQUEST, `userId: ${userId.toString()} user_data already initialized for this user`);

        return this.userDataRepository.create(userData);
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    async getUserData(userId: ObjectId): Promise<UserDataDTO> {

        let userData = await this.userDataRepository.findByUserId(userId);

        if (!userData) await this.create(userId);

        userData = await this.userDataRepository.findByUserId(userId);

        if (!userData) throw new UserDataException("UserData not found", HttpCodes.NOT_FOUND, `UserData Doc for userId: ${userId.toString()} doesn't exists`);

        return userData;

    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async addToSeenTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {
        const userDataDto = await this.getUserData(userId);

        if (userDataDto.unseenTitles.includes(titileId)) {
            await this.userDataRepository.updateUserData(userId, { $pull: { unseenTitles: titileId } })
        }

        const result = await this.userDataRepository.updateUserData(userId, { $addToSet: { seenTitles: titileId } })

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async addToUnSeenTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {
        const userDataDto = await this.getUserData(userId);

        if (userDataDto.seenTitles.includes(titileId)) {
            await this.userDataRepository.updateUserData(userId, { $pull: { seenTitles: titileId } })
        }

        const result = await this.userDataRepository.updateUserData(userId, { $addToSet: { unseenTitles: titileId } })

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async addToFavouriteTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {

        // to find if title already in favorites
        // const userDataDto = await this.getUserData(userId);

        const result = await this.userDataRepository.updateUserData(userId, { $addToSet: { favouriteTitles: titileId } });

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async removeFromFavouriteTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {
        // to find if title already not in favorites
        // const userDataDto = await this.getUserData(userId);

        const result = await this.userDataRepository.updateUserData(userId, { $pull: { favouriteTitles: titileId } });

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async addToStarredTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {

        // to find if title already in starred
        // const userDataDto = await this.getUserData(userId);

        const result = await this.userDataRepository.updateUserData(userId, { $addToSet: { starredTitles: titileId } });

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * 
     * @param userId 
     * @param titileId 
     */
    async removeFromStarredTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean> {

        // to find if title already in starred
        // const userDataDto = await this.getUserData(userId);

        const result = await this.userDataRepository.updateUserData(userId, { $pull: { starredTitles: titileId } });

        if (result) {
            return true;
        } else {
            return false
        }
    }

    /**
     * getAllUsersData
     */
    async getAllUsersData(): Promise<UserDataDTO[]> {
        return await this.userDataRepository.findAll();
    }
}

export default UserDataService;