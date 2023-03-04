import TitleType from "@constants/titile.types.enum";
import Joi from "joi";
import baseTitleSchema from "./base.joi.title.schema";
import { titleAuthorSchema } from "./common.title.joi.schemas";



const movieSchema: Joi.ObjectSchema = baseTitleSchema.keys({
  title_type: Joi.string()
    .valid(TitleType.MOVIE)
    .required(),
}).append({
      // added_by
      added_by: Joi.string().example("user001"),
      // last_modified_by
      last_modified_by: Joi.string().example("user002"),
})

// const movieScsdhema: Joi.ObjectSchema = tempSchema.append({

// })

// Joi.object({
//   baseTitleSchema,
//   title_type: Joi.string()
//   .valid(TitleType.MOVIE)
//   .required(),
//   ...titleAuthorSchema,
// })

export default movieSchema;