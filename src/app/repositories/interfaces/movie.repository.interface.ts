import IMovie from "@models/interfaces/movie.interface";



interface IMovieRepository {
    create(movie: Partial<IMovie>): Promise<IMovie>;
}

export default IMovieRepository;