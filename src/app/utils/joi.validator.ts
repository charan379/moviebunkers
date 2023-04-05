import Joi, { ObjectSchema, AnySchema, ValidationOptions } from "joi";
import HttpCodes from "@constants/http.codes.enum";
import ValidationException from "@exceptions/validation.expception";

/**
 * Validates a request body using a Joi schema.
 * @param {ObjectSchema<any> | AnySchema} joiSchema - The Joi schema to validate the request body against.
 * @param {Object | any} requestBody - The request body to validate.
 * @param {ValidationOptions} options - The validation options.
 * @param {string} sourceFunction - The name of the function where the validation is being performed (optional).
 * @returns {Promise<any>} A Promise that resolves to the validated request body.
 * @throws {ValidationException} If the request validation fails.
 */
async function JoiValidator<T>(joiSchema: ObjectSchema<any> | AnySchema, requestBody: Object | any, options: ValidationOptions, sourceFunction: string = "Not provided") {
    // Validate the request body using the provided Joi schema and options.
    const { value: validatedDTO, error: validationError } = joiSchema.validate(requestBody, options);

    // If the validation failed, throw a ValidationException.
    if (validationError) {
        throw new ValidationException(
            "Request Validation Failed",
            HttpCodes.BAD_REQUEST,
            validationError.message,
            `@JoiValidator.function(): requestBody: ${JSON.stringify(requestBody)} sourceFunction: ${sourceFunction},  ${validationError.stack}`
        );
    }

    // If the validation succeeded, return the validated request body.
    return validatedDTO;
}

export default JoiValidator;
