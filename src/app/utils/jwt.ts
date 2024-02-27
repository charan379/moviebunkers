import jwt, { JwtPayload } from 'jsonwebtoken';
import Config from '@Config';
import HttpCodes from '@constants/http.codes.enum';
import { UserDTO } from '@dto/user.dto';
import AuthorizationException from '@exceptions/authorization.exception';

/**
 * Generates a JWT token for the given user.
 * @param {UserDTO} userDTO - The user object to generate the token for.
 * @returns {Promise<string>} A Promise that resolves to the generated JWT token.
 * @throws {AuthorizationException} If an error occurs while generating the token.
 */
export async function generateJwtToken(userDTO: Partial<UserDTO>): Promise<string> {

    try {
        const signOptions: jwt.SignOptions = {
            expiresIn: "8h",
            algorithm: 'HS256',
        };

        const payload: JwtPayload = {
            sub: userDTO.userName,
        };
        const token = jwt.sign(payload, Config.JWT_SECRET as string, signOptions);
        return token;
    } catch (error: any) {
        throw new AuthorizationException(
            'Token Creation Failed',
            HttpCodes.INTERNAL_SERVER_ERROR,
            `JWT token creation failed for user: ${userDTO.userName}`,
            `@generateJwtToken.function(): UserDetails : ${userDTO}, ${error?.stack}`
        );
    }
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} jwtToken - The JWT token to verify.
 * @returns {Promise<JwtPayload>} A Promise that resolves to the decoded payload of the token.
 * @throws {AuthorizationException} If an error occurs while verifying the token.
 */
export async function verifyJwtToken(jwtToken: string): Promise<JwtPayload> {
    let decodedToken;

    try {
        decodedToken = jwt.verify(jwtToken, Config.JWT_SECRET as string);
    } catch (error: any) {
        if (error?.message === "invalid signature") {
            throw new AuthorizationException(
                "Unauthorized Please Login!",
                HttpCodes.BAD_REQUEST,
                "Token probably modified or signature changed: invalid signature",
                `@verifyJwtToken.function(): invalid signature, ReceivedToken: ${jwtToken} , ${error?.stack}`
            );
        } else if (error.message === "invalid token") {
            throw new AuthorizationException(
                "Unauthorized Please Login!",
                HttpCodes.BAD_REQUEST,
                "Token probably modified or signature changed: invalid token",
                `@verifyJwtToken.function(): invalid token, ReceivedToken: ${jwtToken} ,  ${error?.stack}`
            );
        } else if (error.message === "jwt expired") {
            throw new AuthorizationException(
                "Authentication Expired Please Login!",
                HttpCodes.UNAUTHORIZED,
                "Token Expired Re-authenticate",
                `@verifyJwtToken.function(): jwt expired, ReceivedToken: ${jwtToken} , ${error?.stack}`
            );
        } else {
            throw new AuthorizationException(
                "Internal Server Error",
                HttpCodes.UNAUTHORIZED,
                "Unknown Error Occoured while decoding token",
                `@verifyJwtToken.function(): Unknown Error, ReceivedToken: ${jwtToken} , ${error?.stack}`
            );
        }
    }

    return decodedToken as JwtPayload;
}
