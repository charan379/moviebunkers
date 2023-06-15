import { LoginDTO } from "@dto/user.dto";
import { AuthenticatedUser } from "src/@types";



interface IAuthService {
    login(loginDTO: LoginDTO): Promise<AuthenticatedUser>;
}

export default IAuthService;