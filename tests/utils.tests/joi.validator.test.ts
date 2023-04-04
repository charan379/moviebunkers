import Joi from "joi";
import JoiValidator from "@utils/joi.validator";

describe("JoiValidator function", () => {
    const testSchema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(18).max(100),
        email: Joi.string().email(),
    });

    it("returns validated request body when validation succeeds", async () => {
        // Arrange
        const testRequestBody = {
            name: "John Doe",
            age: 25,
            email: "johndoe@example.com",
        };
        const testOptions = { abortEarly: false };
        const expectedValidatedRequestBody = testRequestBody;

        // Act
        const validatedRequestBody = await JoiValidator(testSchema, testRequestBody, testOptions);

        // Assert
        expect(validatedRequestBody).toEqual(expectedValidatedRequestBody);
    });

    it("throws ValidationException when validation fails", async () => {
        // Arrange
        const testRequestBody = {
            name: "John Doe",
            age: "not a number",
            email: "johndoe@example.com",
        };
        const testOptions = { abortEarly: false };

        // Act & Assert
        await expect(JoiValidator(testSchema, testRequestBody, testOptions)).rejects.toThrowError(
            "Request Validation Failed"
        );
    });
});
