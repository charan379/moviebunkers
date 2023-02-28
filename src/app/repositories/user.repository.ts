import IUserRepository from "@repositories/interfaces/user.repository.interface";
import { ProjectionFields } from "mongoose";
import { Service } from "typedi";
import IUser from "../models/interfaces/user.interface";
import UserModel from "../models/user.modal";
import { FindAllQuery } from "./interfaces/custom.types.interfaces";

@Service()
class UserRepository implements IUserRepository {
  /**
   * userModel monggose
   */
  private userModel = UserModel<IUser>;

  /**
   * create()
   * @param user 
   * @returns new IUser
   */
  create(user: Partial<IUser>): Promise<IUser> {
    return this.userModel.create<Partial<IUser>>(user);
  }
  /**
   * findById()
   * @param id 
   * @param projection 
   * @returns IUser
   */
  findById(
    id: string,
    projection: ProjectionFields<IUser> = { __v: 0, password: 0 }
  ): Promise<IUser | null> {
    return this.userModel.findById(id, projection).lean().exec();
  }
  
  /**
   * findByUserName()
   * @param userName 
   * @returns IUser
   */
  findByUserName(userName: string): Promise<IUser | null> {
    return this.userModel
      .findOne({ userName: userName }, { _id: 0, password: 0, __v: 0 })
      .lean()
      .exec();
  }

  /**
   * findByEmail()
   * @param email 
   * @param projection 
   * @returns IUser
   */
  findByEmail(
    email: string,
    projection: ProjectionFields<IUser> = { _id: 0, password: 0, __v: 0 }
  ): Promise<IUser | null> {
    return this.userModel.findOne({ email: email }, projection).lean().exec();
  }

  /**
   * findAll()
   * @param param0 query object
   * @param projection 
   * @returns List<IUser>
   */
  findAll(
    { query, sort, limit, page }: FindAllQuery,
    projection: ProjectionFields<IUser> = { _id: 0, password: 0, __v: 0 }
  ): Promise<IUser[]> {
    return this.userModel
      .find({ ...query }, projection)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ ...sort })
      .lean()
      .exec();
  }

  /**
   * update()
   * @param userName 
   * @param user 
   * @returns IUser
   */
  update(userName: string, user: Partial<IUser>): Promise<IUser | null> {
    this.userModel
      .findOneAndUpdate({ userName: userName }, { $set: { ...user } })
      .exec();

    return this.findByUserName(userName);
  }

  /**
   * delete()
   * @param id 
   */
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default UserRepository;
