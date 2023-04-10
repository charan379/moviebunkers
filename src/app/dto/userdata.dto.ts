import { ObjectId } from "mongoose";

export default interface UserDataDTO {
    _id?: ObjectId | string,
    userId: ObjectId;
    seenTitles: ObjectId[];
    unseenTitles: ObjectId[];
    starredTitles: ObjectId[];
    favouriteTitles: ObjectId[];
    createdAt: Date;
    updatedAt: Date;

}