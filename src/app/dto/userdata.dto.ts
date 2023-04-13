import IUserData from "@models/interfaces/IUserData";

export default interface UserDataDTO {
    _id: string,
    userId: string;
    seenTitles: string[];
    unseenTitles: string[];
    starredTitles: string[];
    favouriteTitles: string[];
    createdAt: Date;
    updatedAt: Date;

}

export function iuserDataToUserDataDTOMapper(iuserData: IUserData): UserDataDTO {
    const userDataDTO: UserDataDTO = {
        _id: iuserData?._id.toString(),
        userId: iuserData?.userId.toString(),
        seenTitles: iuserData?.seenTitles?.map(id => id.toString()),
        unseenTitles: iuserData?.unseenTitles?.map(id => id.toString()),
        starredTitles: iuserData?.starredTitles?.map(id => id.toString()),
        favouriteTitles: iuserData?.favouriteTitles?.map(id => id.toString()),
        createdAt: iuserData.createdAt,
        updatedAt: iuserData.updatedAt,
    }

    return userDataDTO
}