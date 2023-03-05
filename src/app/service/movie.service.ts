import MovieDTO from "@dto/movie.dto";
import movieSchema from "@joiSchemas/movie.joi.schema";
import IMovie from "@models/interfaces/movie.interface";
import MovieRepository from "@repositories/movie.repository";
import JoiValidator from "@utils/joi.validator";
import { Inject, Service } from "typedi";
import IMovieService from "./interfaces/movie.service.interface";

@Service()
class MovieService implements IMovieService {
    
    private movieRepository: MovieRepository;

    constructor (@Inject() movieRepository: MovieRepository){
        this.movieRepository = movieRepository;
    }


    async createMovie(movieDTO: Partial<MovieDTO>): Promise<MovieDTO> {
        
        const validMovie: MovieDTO = await JoiValidator(movieSchema, movieDTO, {abortEarly:false, stripUnknown: true, allowUnknown: false});
        
        const newMovie = await this.movieRepository.create(validMovie as Partial<IMovie>) as MovieDTO;

        return newMovie;
    }
}

export default MovieService;