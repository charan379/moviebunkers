import Joi from "joi";
import baseTitleSchema from "./base.joi.title.schema";
import { titleAuthorSchema } from "./common.title.joi.schemas";


const movieSchema: Joi.ObjectSchema = Joi.object({
  ...baseTitleSchema,
  ...titleAuthorSchema,
})

export default movieSchema;