import IUserData from "@models/interfaces/IUserData";
import mongoose, { UpdateQuery } from "mongoose";


interface IUserDataRepository {
    create(userData: Partial<IUserData>): Promise<IUserData>;
    findByUserId(userId: mongoose.Types.ObjectId): Promise<IUserData | null>;
    findAll(): Promise<IUserData[]>;
    updateUserData(userId: mongoose.Types.ObjectId, update: UpdateQuery<IUserData>): Promise<boolean>;
}


export default IUserDataRepository;