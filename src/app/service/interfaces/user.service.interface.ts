import { UserDTO } from "@src/app/dto/user.dto";
import { ObjectId } from "mongoose";

interface IUserService {
  getUserById(id: string): Promise<UserDTO | null>;
  getUserByUserName(userName: string): Promise<UserDTO | null>;
  getUserByEmail(email: string): Promise<UserDTO | null>;
  getAllUsers(): Promise<UserDTO[]>;
  updateUserByUserName(userName: string): Promise<UserDTO>;
}

export default IUserService;