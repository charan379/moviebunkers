import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";
import IUser from "@models/interfaces/user.interface";

export interface UserDTO {
    _id: string,
    userName: string;
    email: string;
    status: UserStatus;
    password?: string;
    role: UserRoles;
    last_modified_by?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewUserDTO {
    userName: string;
    email: string;
    password: string;
    status?: UserStatus;
    role?: UserRoles;
}

export interface FindAllUsersQueryDTO {
    userName?: string,
    email?: string,
    status?: UserStatus,
    role?: UserRoles
    minimal?: boolean,
    sort_by?: string,
    page?: number,
    limit?: number
}

export interface UpdateUserDTO {
    role?: UserRoles.GUEST | UserRoles.USER | UserRoles.MODERATOR,
    status?: UserStatus,
    last_modified_by?: string,
}

export interface LoginDTO {
    userName: string;
    password: string;
}

export function iuserToUserDTOMapper(iuser: IUser, options: { withPassword: boolean } = { withPassword: false }) {
    let userDTO: UserDTO;
    if (options.withPassword) {
        userDTO = {
            _id: iuser?._id.toString(),
            userName: iuser?.userName,
            email: iuser?.email,
            status: iuser?.status,
            password: iuser?.password,
            role: iuser?.role,
            createdAt: iuser?.createdAt,
            updatedAt: iuser?.updatedAt,
        }
    } else {
        userDTO = {
            _id: iuser?._id.toString(),
            userName: iuser?.userName,
            email: iuser?.email,
            status: iuser?.status,
            role: iuser?.role,
            createdAt: iuser?.createdAt,
            updatedAt: iuser?.updatedAt,
        }
    }

    return userDTO
}