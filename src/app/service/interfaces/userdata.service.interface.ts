import UserDataDTO from "@dto/userdata.dto";

interface IUserDataService {
    create(userId: string): Promise<Partial<UserDataDTO>>;
    getUserData(userId: string): Promise<UserDataDTO>;
    getAllUsersData(): Promise<UserDataDTO[]>;
    addToSeenTitles(userId: string, titileId: string): Promise<boolean>;
    addToUnSeenTitles(userId: string, titileId: string): Promise<boolean>;
    addToFavouriteTitles(userId: string, titileId: string): Promise<boolean>;
    removeFromFavouriteTitles(userId: string, titileId: string): Promise<boolean>;
    addToStarredTitles(userId: string, titileId: string): Promise<boolean>;
    removeFromStarredTitles(userId: string, titileId: string): Promise<boolean>;
}

export default IUserDataService;