import IMovie from "@models/interfaces/movie.interface";
import MovieModel from "@models/movie.model";
import { Model } from "mongoose";
import { Service } from "typedi";
import IMovieRepository from "./interfaces/movie.repository.interface";


@Service()
class MovieRepository implements IMovieRepository {

    private movieModel: Model<IMovie>;

    constructor(){
        this.movieModel = MovieModel;
    }

    /**
     * create()
     * @param movie 
     * @returns 
     */
    create(movie: Partial<IMovie>): Promise<IMovie> {
       return  this.movieModel.create<Partial<IMovie>>(movie);
    }
    
}

export default MovieRepository