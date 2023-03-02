import HttpCodes from "@constants/http.codes.enum";
import { LoginDTO, UserDTO } from "@dto/user.dto";
import UserException from "@exceptions/user.exception";
import { validateHash } from "@utils/bcrypt";
import { generateJwtToken } from "@utils/jwt";
import { Inject, Service } from "typedi";
import IAuthService from "./interfaces/auth.service.interface";
import { UserService } from "./user.service";


@Service()
export class AuthService implements IAuthService {

    private userService: UserService;

    constructor(@Inject() userService: UserService){
        this.userService = userService;
    }

    public async login(loginDTO: LoginDTO): Promise<string> {
        
        const userDTO : UserDTO = await this.userService.getUserByUserName(loginDTO.userName);

        if(!userDTO.password) throw new UserException('Internal Server Error', HttpCodes.INTERNAL_SERVER_ERROR, "Can't get user password from service", ` @AuthService.class: @login.method():  UserDTO: ${JSON.stringify(userDTO)}, LoginDTO: ${JSON.stringify(loginDTO)}`);
        
        const validPassword: boolean = await validateHash(loginDTO.password, userDTO?.password);

        if (!validPassword) throw new UserException('Incorrect Password !', HttpCodes.BAD_REQUEST, "User found but hash validation failed probably Incorrect password", `@AuthService.class: @login.method(): UserDTO: ${JSON.stringify(userDTO)}, LoginDTO: ${JSON.stringify(loginDTO)}`)

        const token: string = await generateJwtToken(userDTO);

        return token;
    }
    
}
