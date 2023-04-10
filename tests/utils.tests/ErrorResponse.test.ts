import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import ErrorResponse from "@utils/ErrorResponse";

describe("ErrorResponse", () => {
    it("should return error response object with default status code when status code is not provided in error object", () => {
        const error = new MoviebunkersException("Test error message");
        const response = ErrorResponse({ error });
        expect(response).toEqual({
            success: false,
            error: {
                name: "MoviebunkersException",
                status: HttpCodes.INTERNAL_SERVER_ERROR,
                message: "Test error message",
                reason: "empty reason",
            },
        });
    });

    it("should return error response object with provided status code in error object", () => {
        const error = new MoviebunkersException(
            "Test error message",
            HttpCodes.BAD_REQUEST
        );
        const response = ErrorResponse({ error });
        expect(response).toEqual({
            success: false,
            error: {
                name: "MoviebunkersException",
                status: HttpCodes.BAD_REQUEST,
                message: "Test error message",
                reason: "empty reason",
            },
        });
    });

    it("should return error response object with provided message and status code in error object", () => {
        const error = new MoviebunkersException(
            "Test error message",
            HttpCodes.BAD_REQUEST,
            "Test reason"
        );
        const response = ErrorResponse({ error });
        expect(response).toEqual({
            success: false,
            error: {
                name: "MoviebunkersException",
                status: HttpCodes.BAD_REQUEST,
                message: "Test error message",
                reason: "Test reason",
            },
        });
    });

    it("should return an error response object with default values if error is not provided", () => {
        const response = ErrorResponse({ error: undefined });
        expect(response).toEqual({
            success: false,
            error: {
                name: "Unknown Error",
                status: HttpCodes.INTERNAL_SERVER_ERROR,
                message: "empty message",
                reason: "empty reason",
            },
        });
    });

});

