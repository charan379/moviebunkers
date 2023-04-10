import TvDTO from "@dto/Tv.dto";
import { UserDTO } from "@dto/user.dto";


interface ITvService {
    createTv(tvDTO: Partial<TvDTO>, userDTO: UserDTO): Promise<TvDTO>;
    updateTvById(tvId: string, tv: Partial<TvDTO>): Promise<TvDTO>;
}

export default ITvService;