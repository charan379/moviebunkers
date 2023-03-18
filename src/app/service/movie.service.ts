import MovieDTO from "@dto/movie.dto";
import { UserDTO } from "@dto/user.dto";
import movieSchema from "@joiSchemas/movie.joi.schema";
import IMovie from "@models/interfaces/movie.interface";
import MovieRepository from "@repositories/movie.repository";
import JoiValidator from "@utils/joi.validator";
import { ObjectId } from "mongoose";
import { Inject, Service } from "typedi";
import IMovieService from "./interfaces/movie.service.interface";

@Service()
class MovieService implements IMovieService {

    private movieRepository: MovieRepository;

    constructor(@Inject() movieRepository: MovieRepository) {
        this.movieRepository = movieRepository;
    }


    async createMovie(movieDTO: Partial<MovieDTO>, userDTO: UserDTO): Promise<MovieDTO> {

        const validMovie: MovieDTO = await JoiValidator(movieSchema, movieDTO, { abortEarly: false, stripUnknown: true, allowUnknown: false });

        const movie: MovieDTO = { ...validMovie, added_by: userDTO._id as ObjectId, last_modified_by: userDTO._id as ObjectId }

        const newMovie = await this.movieRepository.create(movie as Partial<IMovie>) as MovieDTO;

        return newMovie;
    }
}

export default MovieService;