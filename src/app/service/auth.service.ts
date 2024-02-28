import HttpCodes from "@constants/http.codes.enum";
import { LoginDTO, UserDTO } from "@dto/user.dto";
import AuthorizationException from "@exceptions/authorization.exception";
import { validateHash } from "@utils/bcrypt";
import { generateJwtToken } from "@utils/jwt";
import { Inject, Service } from "typedi";
import IAuthService from "./interfaces/auth.service.interface";
import { UserService } from "./user.service";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import { AuthenticatedUser } from "src/@types";

/**
 * AuthService - Service responsible for authentication and authorization of users.
 * @class
 */
@Service()
export class AuthService implements IAuthService {

    private userService: UserService;

    /**
     * Constructor method for AuthService.
     * @constructor
     * @param {UserService} userService - An instance of the UserService class.
     */
    constructor(@Inject() userService: UserService) {
        this.userService = userService;
    }

    /**
     * Authenticates a user with the provided login credentials.
     * @param {LoginDTO} loginDTO - The login credentials of the user.
     * @returns {string} - A JWT token string on successful authentication.
     * @throws {AuthorizationException} - If the user is not found or the password is incorrect.
     */
    public async login(loginDTO: LoginDTO): Promise<AuthenticatedUser> {
        try {
            // Get user details by username.
            const userDTO: UserDTO = await this.userService.getUserByUserName(loginDTO.userName, true);

            // If user password is not available, throw exception.
            if (!userDTO.password) {
                throw new AuthorizationException(
                    'Internal Server Error',
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    "Can't get user password from service",
                    ` @AuthService.class: @login.method():  UserDTO: ${JSON.stringify(userDTO)}, LoginDTO: ${JSON.stringify(loginDTO)}`
                );
            }

            // Validate user password.
            const validPassword: boolean = await validateHash(loginDTO.password, userDTO?.password);

            // If password is invalid, throw exception.
            if (!validPassword) {
                throw new AuthorizationException(
                    'Incorrect Password !',
                    HttpCodes.BAD_REQUEST,
                    "User found but hash validation failed probably Incorrect password",
                    `@AuthService.class: @login.method(): UserDTO: ${JSON.stringify(userDTO)}, LoginDTO: ${JSON.stringify(loginDTO)}`
                );
            }

            // Generate a JWT token for the user.
            const token: string = await generateJwtToken(userDTO);

            const { _id, userName, email, status, role, createdAt, updatedAt } = userDTO;

            const tokenExpiresAt= new Date();
            // tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 7, tokenExpiresAt.getMinutes() + 30);
            tokenExpiresAt.setMinutes(tokenExpiresAt.getMinutes() + 1);

            const authenticatedUser: AuthenticatedUser = {
                userId: _id,
                userName: userName,
                email: email, status: status,
                role: role,
                createdAt: createdAt,
                updatedAt: updatedAt,
                token: token,
                tokenExpiresAt: tokenExpiresAt,
                loggedInAt: new Date(),
            }
            // Return the authenticatedUser.
            return authenticatedUser
        } catch (error: any) {
            // Catch any exception and re-throw it as an AuthorizationException.
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                throw new AuthorizationException(
                    error?.message,
                    HttpCodes.CONFLICT,
                    `${JSON.stringify(error?.stack)}`,
                    `@AuthService.class: @login.method()`
                );
            }
        }
    }


    /**
     * Returns the user details of the authenticated user based on their username.
     * @param {string | undefined} userName - The username of the authenticated user.
     * @returns {Promise<UserDTO>} - The user details of the authenticated user.
     * @throws {AuthorizationException} - Throws an AuthorizationException if the username is not provided or if there is an error while retrieving the user details.
     */
    public async WhoAmI(userName: string | undefined): Promise<UserDTO> {
        try {
            // If the username is not provided, throw an AuthorizationException
            if (!userName) {
                throw new AuthorizationException('Unauthorized: Please login!', HttpCodes.UNAUTHORIZED, "userName cookie not present in signed cookies", `@AuthService.class: @WhoAmI.method(): userName : ${userName}`);
            }

            // Retrieve the user details using the username
            const user: UserDTO = await this.userService.getUserByUserName(userName, false);

            // Return the user details
            return user;
        } catch (error: any) {
            // If an error occurs, throw an AuthorizationException with the error message and stack trace
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                throw new AuthorizationException(error?.message, HttpCodes.CONFLICT, `${JSON.stringify(error?.stack)}`, `@AuthService.class: @WhoAmI.method()`);
            }
        }
    }

}
