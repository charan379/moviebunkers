import mongoose from "mongoose";

interface IUserData {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    seenTitles: mongoose.Types.ObjectId[];
    unseenTitles: mongoose.Types.ObjectId[];
    starredTitles: mongoose.Types.ObjectId[];
    favouriteTitles: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export default IUserData;