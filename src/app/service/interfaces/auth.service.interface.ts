import { LoginDTO } from "@dto/user.dto";



interface IAuthService {
    login(loginDTO: LoginDTO): Promise<string>;
}

export default IAuthService;