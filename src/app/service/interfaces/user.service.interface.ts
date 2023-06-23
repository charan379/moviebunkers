import OTPtype from "@constants/otpType.enum";
import PageDTO from "@dto/page.dto";
import { FindAllUsersQueryDTO, NewUserDTO, UpdateUserDTO, UserDTO } from "@dto/user.dto";

interface IUserService {
  getUserById(id: string): Promise<UserDTO>;
  getUserByUserName(userName: string, withPassword: boolean): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getAllUsers(queryDTO: FindAllUsersQueryDTO): Promise<PageDTO>;
  updateUserByUserName(userName: string, userUpdateDTO: UpdateUserDTO): Promise<UserDTO>;
  createUser(newUserDTO: NewUserDTO): Promise<UserDTO>;
  changeUserPassword(userName: string, newPassword: string): Promise<UserDTO>;
  restUserPassword(userName: string, newPassword: string, otp: string): Promise<UserDTO>;
  generateUserOtp(userName: string, otpType: OTPtype): Promise<UserDTO>;
  scrapUserOtp(userName: string): Promise<boolean>;
  completeUserEmailVerification(userName: string, otp: string): Promise<UserDTO>;

}

export default IUserService;