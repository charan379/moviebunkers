import HttpCodes from "@constants/http.codes.enum";
import UserDataException from "@exceptions/userdata.exception";
import IUserData from "@models/interfaces/user.data.interface";

/**
 * Data Transfer Object (DTO) representing user data
 */
export default interface UserDataDTO {
    _id: string, // Unique identifier for the user
    userId: string; // User ID
    seenTitles: string[]; // List of titles the user has seen
    unseenTitles: string[]; // List of titles the user has not seen
    starredTitles: string[]; // List of titles the user has starred
    favouriteTitles: string[]; // List of titles the user has marked as favourite
    createdAt: Date; // Date the user data was created
    updatedAt: Date; // Date the user data was last updated
}

/**
 * Maps a user data object from the database schema (IUserData) to the DTO representation (UserDataDTO)
 * @param iuserData The user data object from the database schema
 * @returns The user data object represented as a DTO
 * @throws {UserDataException} If User Data DTO Mapping failed
 */
export function iuserDataToUserDataDTOMapper(iuserData: IUserData): UserDataDTO {
    try {
        const userDataDTO: UserDataDTO = {
            _id: iuserData?._id.toString(), // Convert the _id field to a string
            userId: iuserData?.userId.toString(), // Convert the userId field to a string
            seenTitles: iuserData?.seenTitles?.map(id => id.toString()), // Convert each ID in the seenTitles array to a string
            unseenTitles: iuserData?.unseenTitles?.map(id => id.toString()), // Convert each ID in the unseenTitles array to a string
            starredTitles: iuserData?.starredTitles?.map(id => id.toString()), // Convert each ID in the starredTitles array to a string
            favouriteTitles: iuserData?.favouriteTitles?.map(id => id.toString()), // Convert each ID in the favouriteTitles array to a string
            createdAt: iuserData.createdAt, // Copy the createdAt field as is
            updatedAt: iuserData.updatedAt, // Copy the updatedAt field as is
        }

        return userDataDTO
    } catch (error: any) {
        throw new UserDataException(
            `USER Data DTO Mapping Failed`,
            HttpCodes.CONFLICT,
            error?.message,
            `iuserDataToUserDataDTOMapper.function()`)
    }
}
