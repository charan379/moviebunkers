import IMovie from "@models/interfaces/movie.interface";



interface IMovieRepository {
    create(movie: Partial<IMovie>): Promise<IMovie>;
    updateMovieById(movieId: string, movie: Partial<IMovie>): Promise<IMovie | null>;
}

export default IMovieRepository;