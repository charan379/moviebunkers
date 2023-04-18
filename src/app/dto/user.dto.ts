import HttpCodes from "@constants/http.codes.enum";
import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";
import UserException from "@exceptions/user.exception";
import IUser from "@models/interfaces/user.interface";

/**
 * Data transfer object for User entities.
 */
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

/**
 * Data transfer object for creating new User entities.
 */
export interface NewUserDTO {
    userName: string;
    email: string;
    password: string;
    status?: UserStatus;
    role?: UserRoles;
}

/**
 * Data transfer object for querying User entities.
 */
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

/**
 * Data transfer object for updating User entities.
 */
export interface UpdateUserDTO {
    role?: UserRoles.GUEST | UserRoles.USER | UserRoles.MODERATOR,
    status?: UserStatus,
    last_modified_by?: string,
}

/**
 * Data transfer object for user login.
 */
export interface LoginDTO {
    userName: string;
    password: string;
}

/**
 * Maps an IUser instance to a UserDTO instance.
 * @param iuser - The IUser instance to map to a UserDTO.
 * @param options - An optional object that contains a boolean value for `withPassword` option.
 * If true, maps the `password` field to the UserDTO instance.
 * Default is false.
 * @returns A new UserDTO instance with data from the provided IUser instance.
 * @throws {UserException} If DTO mapping failed
 */
export function iuserToUserDTOMapper(iuser: IUser | any, options: { withPassword: boolean } = { withPassword: false }): UserDTO {
    try {
        let userDTO: UserDTO;
        if (options.withPassword) {
            userDTO = {
                _id: iuser?._id?.toString() ?? "",
                userName: iuser?.userName ?? "",
                email: iuser?.email ?? "",
                status: iuser?.status ?? "",
                password: iuser?.password ?? "",
                role: iuser?.role ?? "",
                createdAt: iuser?.createdAt ?? "",
                updatedAt: iuser?.updatedAt ?? "",
            }
        } else {
            userDTO = {
                _id: iuser?._id?.toString() ?? "",
                userName: iuser?.userName ?? "",
                email: iuser?.email ?? "",
                status: iuser?.status ?? "",
                role: iuser?.role ?? "",
                createdAt: iuser?.createdAt ?? "",
                updatedAt: iuser?.updatedAt ?? "",
            }
        }

        return userDTO
    } catch (error: any) {
        throw new UserException(
            `USER DTO Mapping Failed`,
            HttpCodes.CONFLICT,
            error?.message,
            `iuserToUserDTOMapper.function()`)
    }
}