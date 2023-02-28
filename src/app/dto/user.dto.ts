import UserRoles from "@src/app/constants/user.roles.enum";
import UserStatus from "@src/app/constants/user.status.enum";


export interface UserDTO {
    userName: string;
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
    query? : Object,
    minimal? : boolean,
    sort? : Object,
    page? : number,
    limit?: number
}