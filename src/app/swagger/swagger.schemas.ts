import { episodeSchema } from "@joiSchemas/episode.joi.schema";
import linkSchema from "@joiSchemas/linkSchema";
import { seasonSchema } from "@joiSchemas/season.joi.schema";
import titleSchema from "@joiSchemas/title.joi.schema";
import { lgoinSchema, newUserSchema, userUpdateSchema } from "@joiSchemas/user.joi.schemas";
import joiToSwagger from "joi-to-swagger";

const swaggerSchemas = {
    new_user: joiToSwagger(newUserSchema).swagger,
    login: joiToSwagger(lgoinSchema).swagger,
    update_user: joiToSwagger(userUpdateSchema).swagger,
    title: joiToSwagger(titleSchema).swagger,
    link: joiToSwagger(linkSchema).swagger,
    episode: joiToSwagger(episodeSchema).swagger,
    season: joiToSwagger(seasonSchema).swagger,
}

export default swaggerSchemas;