import Config from '@Config';
import HttpCodes from '@constants/http.codes.enum';
import { UserDTO } from '@dto/user.dto';
import AuthorizationException from '@exceptions/authorization.exception';
import jwt, { JwtPayload } from 'jsonwebtoken';


export async function generateJwtToken(userDTO: UserDTO): Promise<string> {

    let token;

    const signOptions: jwt.SignOptions = {
        expiresIn: "30d",
        algorithm: 'HS256',
    }

    const payload: JwtPayload = {
        sub: userDTO.userName,
    }

    try {

        token = jwt.sign(payload, Config.JWT_SECRET as string, signOptions);

    } catch (error: any) {
        throw new AuthorizationException('Token Creation Failed', HttpCodes.INTERNAL_SERVER_ERROR, `jwt token creation failed for user: ${userDTO.userName}`, `@generateJwtToken.function(): UserDetails : ${userDTO}, ${error?.stack}`);
    }
    return token;
}

export async function verifyJwtToken(jwtToken: string): Promise<JwtPayload | string> {
    let deCodedToken;

    try {
        deCodedToken = jwt.verify(jwtToken, Config.JWT_SECRET as string);

    } catch (error: any) {
        /**
         * if thrown error is " invalid signature "
         */
        if (error?.message === "invalid signature") {
            throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.BAD_REQUEST, "token probably be modified or signature changed: invalid signature", `@verifyJwtToken.function(): invalid signature, ReceivedToken: ${jwtToken} , ${error?.stack}`);
        }

        /**
         * if thrown error is " invalid token "
         */
        if (error.message === "invalid token") {
            throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.BAD_REQUEST, "token probably modified or signature changed: invalid token", `@verifyJwtToken.function(): invalid token, ReceivedToken: ${jwtToken} ,  ${error?.stack}`);
        }

        /**
         * if thrown error is " jwt expired "
         */
        if (error.message === "jwt expired") {
            throw new AuthorizationException("Authentication Expired Please Login!", HttpCodes.UNATHORIZED, "Token Expired Re-authenticate", `@verifyJwtToken.function(): jwt expired, ReceivedToken: ${jwtToken} , ${error?.stack}`);
        }

        /**
         * If any other error is thrown 
         */
        throw new AuthorizationException("Internal Server Error", HttpCodes.UNATHORIZED, "Unknown Error Occoured while decodeing token", `@verifyJwtToken.function(): Unknown Error, ReceivedToken: ${jwtToken} , ${error?.stack}`);
    }

    /**
     * if no errors are thrown than return de-coded token details
     */
    return deCodedToken;
}