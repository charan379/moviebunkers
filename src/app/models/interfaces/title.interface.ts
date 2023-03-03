import IMovie from "./movie.interface";
import ITv from "./tv.interface";


interface ITitle extends IMovie, ITv {

}

export default ITitle;