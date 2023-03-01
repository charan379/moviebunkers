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

    try {
        token = jwt.sign({ userName: userDTO.userName }, "privateOrsecretKeyHere", signOptions);
    } catch (error: any) {
        throw new AuthorizationException('Failed to create token', HttpCodes.INTERNAL_SERVER_ERROR, `jwt token creation failed fro user: ${userDTO.userName}`, `UserDetails : ${userDTO} \n  Stack: ${error?.stack}`);
    }
    return token;
}

export async function verifyJwtToken(jwtToken: string): Promise<JwtPayload | string> {
    let deCodedToken;

    try {
        deCodedToken = jwt.verify(jwtToken, "privateOrsecretKeyHere");

    } catch (error: any) {
        /**
         * if thrown error is " invalid signature "
         */
        if (error?.message === "invalid signature") {
            throw new AuthorizationException("Failed to decode token", HttpCodes.BAD_REQUEST, "token seams to me modified: invalid signature", `ReceivedToken: ${jwtToken} \n Stack: ${error?.stack}`);
        }

        /**
         * if thrown error is " invalid token "
         */
        if (error.message === "invalid token") {
            throw new AuthorizationException("Failed to decode token", HttpCodes.BAD_REQUEST, "token seams to me modified: invalid token", `ReceivedToken: ${jwtToken} \n Stack: ${error?.stack}`);
        }

        /**
         * if thrown error is " jwt expired "
         */
        if (error.message === "jwt expired") {
            throw new AuthorizationException("Authentication Expired", HttpCodes.UNATHORIZED, "Token Expired Re-authenticate", `ReceivedToken: ${jwtToken} \n Stack: ${error?.stack}`);
        }

        /**
         * If any other error is thrown 
         */
        throw new AuthorizationException("Internal Server Error", HttpCodes.UNATHORIZED, "Unknown Error Occoured while decodeing token", `ReceivedToken: ${jwtToken} \n Stack: ${error?.stack}`);
    }

    /**
     * if no errors are thrown than return de-coded token details
     */
    return deCodedToken;
}