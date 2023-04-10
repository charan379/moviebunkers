import BaseTitleDTO from "./base.title.dto";
import TitleAuthorDTO from "./title.author.dto";



interface MovieDTO extends BaseTitleDTO, TitleAuthorDTO {
    
}

export default MovieDTO;