import HttpCodes from "@constants/http.codes.enum";
import MovieDTO from "@dto/movie.dto";
import { UserDTO } from "@dto/user.dto";
import TitleException from "@exceptions/title.exeception";
import movieSchema from "@joiSchemas/movie.joi.schema";
import IMovie from "@models/interfaces/movie.interface";
import MovieRepository from "@repositories/movie.repository";
import deleteImage from "@utils/deleteImage";
import downloadImageFromUrl from "@utils/downloadImageFromUrl";
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

    /**
     * createMovie()
     * @param movieDTO 
     * @param userDTO 
     * @returns 
     */
    async createMovie(movieDTO: Partial<MovieDTO>, userDTO: UserDTO): Promise<MovieDTO> {

        const validMovie: MovieDTO = await JoiValidator(movieSchema, movieDTO, { abortEarly: false, stripUnknown: true, allowUnknown: false });

        const movie: MovieDTO = { ...validMovie, added_by: userDTO._id as ObjectId, last_modified_by: userDTO._id as ObjectId }

        const newMovie = await this.movieRepository.create(movie as Partial<IMovie>) as MovieDTO;

        return newMovie;
    }

    /**
     * updateMovieById()
     * @param movieId 
     * @param movie 
     */
    async updateMovieById(movieId: string, movie: Partial<IMovie>): Promise<MovieDTO> {

        // commenting out until buying a VPS
        // try {
        //     movie = { ...movie, poster_path: await downloadImageFromUrl(movie?.poster_path as string, movieId) }
        // } catch (error) {
        //     movie = { ...movie, poster_path: movie?.poster_path }
        // }

        const validMovie: MovieDTO = await JoiValidator(movieSchema, movie, { abortEarly: false, stripUnknown: true, allowUnknown: false });


        let updatedMovie: MovieDTO | null = await this.movieRepository.updateMovieById(movieId, validMovie);

        if (!updatedMovie) throw new TitleException("Movie update failed", HttpCodes.INTERNAL_SERVER_ERROR, `Somthing went wrong movie not updated`, `@MovieService.class: @updateMovieById.method() movieId: ${movieId} ,movieDTO: ${JSON.stringify(movie)}`);

        return updatedMovie;
    }
}

export default MovieService;