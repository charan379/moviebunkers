import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";

interface IUser {
  userName: string;
  email: string;
  password: string;
  status: UserStatus;
  role: UserRoles;
  last_modified_by: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;