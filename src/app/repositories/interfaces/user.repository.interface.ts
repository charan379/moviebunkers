import IUser from "@models/interfaces/user.interface";
import { ProjectionFields } from "mongoose";
import { FindAllQuery } from "./custom.types.interfaces";

interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string,projection : ProjectionFields<IUser>): Promise<IUser | null>;
  findByUserName(userName: string,projection : ProjectionFields<IUser>): Promise<IUser | null>;
  findByEmail(email: string,projection : ProjectionFields<IUser>): Promise<IUser | null>;
  findAll({query, sort, limit, page}: FindAllQuery, projection: ProjectionFields<IUser>): Promise<IUser[]>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export default IUserRepository;
