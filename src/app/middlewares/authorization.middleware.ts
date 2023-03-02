import HttpCodes from "@constants/http.codes.enum";
import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";
import { UserDTO } from "@dto/user.dto";
import AuthorizationException from "@exceptions/authorization.exception";
import { UserService } from "@service/user.service";
import { verifyJwtToken } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Container from "typedi";



export default function Authorize(allowedRoles: UserRoles[]) {

    const userService = Container.get(UserService);

    return [

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                //Authorization: 'Bearer TOKEN' or In signedCookies auth: 'Bearer TOKEN'
                const auth: string = req?.headers?.authorization || req?.signedCookies?.auth;
                if (!auth) throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.UNATHORIZED, "Token Not Provided at headers or cookies");

                const authToken: string = auth.split(" ")[1];
                if (!authToken) throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.UNATHORIZED, "headers or cookies auth persists but not in format of: 'Bearer TOKEN' ");

                /**
                 * verifyJwtToken and store deCodedToken details
                 */
                const deCodedToken: JwtPayload | string = await verifyJwtToken(authToken);

                let jwtUserName: string | (() => string) | undefined = deCodedToken?.sub ?? undefined;
                if (!jwtUserName) throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.UNATHORIZED, "token decoded but userName sub not found in token payload", `Stack: token: ${authToken}`);


                const userDTO: UserDTO = await userService.getUserByUserName(jwtUserName as string);
                if (!userDTO) throw new AuthorizationException("Unauthorized Please Login!", HttpCodes.UNATHORIZED, "token decoded but userName not found in DB", `Stack: token: ${authToken}`);
                if (userDTO.status !== UserStatus.ACTIVE) throw new AuthorizationException("Inactive User, Access Blocked !", HttpCodes.UNATHORIZED, "token decoded but user is inactive in db", `Stack: token: ${authToken}`);

                if (allowedRoles.indexOf(userDTO.role) === -1) throw new AuthorizationException("Insufficient User Role, Access Blocked !", HttpCodes.UNATHORIZED, "token decoded but user role is allowed to access this resource", `Stack: token: ${authToken}, \n UserRole: ${userDTO.role}, \n Required Roles : ${allowedRoles.toString()} `);

                req.userName = userDTO.userName;

                next();
            } catch (error) {

                next(error);

            }
        }
    ]
}