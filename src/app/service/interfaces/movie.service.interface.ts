import MovieDTO from "@dto/movie.dto";


interface IMovieService {
    createMovie(movieDTO: Partial<MovieDTO>): Promise<MovieDTO>;
}

export default IMovieService;