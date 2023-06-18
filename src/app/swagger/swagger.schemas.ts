import { episodeSchema } from "@joiSchemas/episode.joi.schema";
import linkSchema from "@joiSchemas/linkSchema";
import { seasonSchema } from "@joiSchemas/season.joi.schema";
import titleSchema from "@joiSchemas/title.joi.schema";
import { loginSchema, msAdmUpdatePassSchema, newUserSchema, userUpdateSchema } from "@joiSchemas/user.joi.schemas";
import joiToSwagger from "joi-to-swagger";

const swaggerSchemas = {
    new_user: joiToSwagger(newUserSchema).swagger,
    login: joiToSwagger(loginSchema).swagger,
    update_user: joiToSwagger(userUpdateSchema).swagger,
    title: joiToSwagger(titleSchema).swagger,
    link: joiToSwagger(linkSchema).swagger,
    episode: joiToSwagger(episodeSchema).swagger,
    season: joiToSwagger(seasonSchema).swagger,
    ms_adm_update_pass: joiToSwagger(msAdmUpdatePassSchema).swagger,
}

export default swaggerSchemas;