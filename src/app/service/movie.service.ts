import { Service } from "typedi";
import IMovieService from "./interfaces/movie.service.interface";


@Service()
class MovieService implements IMovieService {
    createMovie(movieDTO: Partial<MovieDTO>): Promise<MovieDTO> {
        throw new Error("Method not implemented.");
    }
}

export default MovieService;