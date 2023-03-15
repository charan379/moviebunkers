import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";


export interface UserDTO {
    userName: string;
    password?: string;
    email: string;
    status: UserStatus;
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