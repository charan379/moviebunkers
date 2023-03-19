import IUserData from "@models/interfaces/IUserData";
import { ObjectId, UpdateQuery } from "mongoose";


interface IUserDataRepository {
    create(userData: Partial<IUserData>): Promise<IUserData>;
    findByUserId(userId: ObjectId): Promise<IUserData | null>;
    findAll(): Promise<IUserData[]>;
    updateUserData(userId: ObjectId, update: UpdateQuery<IUserData>): Promise<boolean>;
}


export default IUserDataRepository;