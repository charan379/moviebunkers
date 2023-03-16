import MovieDTO from "@dto/movie.dto";
import { UserDTO } from "@dto/user.dto";


interface IMovieService {
    createMovie(movieDTO: Partial<MovieDTO>, userDTO: UserDTO): Promise<MovieDTO>;
}

export default IMovieService;