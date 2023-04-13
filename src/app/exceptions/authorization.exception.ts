import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "./moviebunkers.exception";

/**
 * Exception for authorization errors.
 * @class
 * @extends MoviebunkersException
 */
class AuthorizationException extends MoviebunkersException {
    /**
     * Create an AuthorizationException.
     * @constructor
     * @param {string} message - The error message.
     * @param {HttpCodes} [status] - The HTTP status code.
     * @param {string} [reason] - The reason for the error.
     * @param {string} [stack] - The stack trace.
     */
    constructor(
        message: string,
        status?: HttpCodes | undefined,
        reason?: string | undefined,
        stack?: string | undefined
    ) {
        super(message, status, reason, stack);
        this.name = "AuthorizationException";
    }
}

export default AuthorizationException;
