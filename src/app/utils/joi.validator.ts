import Joi from "joi";
import HttpCodes from "@constants/http.codes.enum";
import ValidationException from "@exceptions/validation.expception";

async function JoiValidator(joiSchema: Joi.ObjectSchema<any> | Joi.AnySchema , requestBody: Object, options: Joi.ValidationOptions){


    const {value: DTO, error: errors} = await joiSchema.validate(requestBody, options);

    if (errors){
        throw new ValidationException("Request Validation Failed", HttpCodes.BAD_REQUEST, errors.message, `@JoiValidator.function(): requestBody: ${JSON.stringify(requestBody)},  ${errors.stack}` )
    }

    return DTO;
}


export default JoiValidator;
