import UserDataDTO from "@dto/userdata.dto";
import { ObjectId } from "mongoose";


interface IUserDataService {
    create(userId: ObjectId): Promise<Partial<UserDataDTO>>;
    getUserData(userId: ObjectId): Promise<UserDataDTO>;
    getAllUsersData(): Promise<UserDataDTO[]>;
    addToSeenTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
    addToUnSeenTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
    addToFavouriteTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
    removeFromFavouriteTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
    addToStarredTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
    removeFromStarredTitles(userId: ObjectId, titileId: ObjectId): Promise<boolean>;
}

export default IUserDataService;