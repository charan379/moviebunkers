import IMovie from "./movie.interface";
import ITv from "./tv.interface";


interface ITitle extends IMovie, ITv {
    _id: string;
}

export default ITitle;