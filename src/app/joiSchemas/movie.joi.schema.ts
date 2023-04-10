import TitleType from "@constants/titile.types.enum";
import Joi from "joi";
import baseTitleSchema from "./base.joi.title.schema";



const movieSchema: Joi.ObjectSchema = baseTitleSchema.keys({
  title_type: Joi.string()
    .valid(TitleType.MOVIE)
    .required(),
})

export default movieSchema;