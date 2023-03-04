import movieSchema from "@joiSchemas/movie.joi.schema";
import tvSchema from "@joiSchemas/tv.joi.schema";
import { lgoinSchema, newUserSchema, userUpdateSchema } from "@joiSchemas/user.joi.schemas";
import joiToSwagger from "joi-to-swagger";

const swaggerSchemas =  {
    new_user: joiToSwagger(newUserSchema).swagger,
    login: joiToSwagger(lgoinSchema).swagger,
    update_user: joiToSwagger(userUpdateSchema).swagger,
    new_movie: joiToSwagger(movieSchema).swagger,
    new_tv: joiToSwagger(tvSchema).swagger,
}

export default swaggerSchemas;