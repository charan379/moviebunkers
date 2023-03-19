import { ObjectId } from "mongoose";

interface IUserData {
    userId: ObjectId;
    seenTitles: ObjectId[];
    unseenTitles: ObjectId[];
    starredTitles: ObjectId[];
    favouriteTitles: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export default IUserData;