import Joi from "joi";
import HttpCodes from "@constants/http.codes.enum";
import ValidationException from "@exceptions/validation.expception";

async function JoiValidator(joiSchema: Joi.ObjectSchema<any> | Joi.AnySchema, requestBody: Object | any, options: Joi.ValidationOptions, sourceFunction: string = "Not provided") {


    const { value: DTO, error: errors } = joiSchema.validate(requestBody, options);

    if (errors) {
        throw new ValidationException("Request Validation Failed", HttpCodes.BAD_REQUEST, errors.message, `@JoiValidator.function(): requestBody: ${JSON.stringify(requestBody)} sourceFunction: ${sourceFunction},  ${errors.stack}`)
    }

    return DTO;
}


export default JoiValidator;
