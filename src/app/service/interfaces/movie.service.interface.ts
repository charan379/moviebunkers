import MovieDTO from "@dto/movie.dto";
import { UserDTO } from "@dto/user.dto";
import IMovie from "@models/interfaces/movie.interface";


interface IMovieService {
    createMovie(movieDTO: Partial<MovieDTO>, userDTO: UserDTO): Promise<MovieDTO>;
    updateMovieById(movieId: string, movie: Partial<IMovie>): Promise<MovieDTO>;
}

export default IMovieService;