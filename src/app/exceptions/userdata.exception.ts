import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * Custom error class for exceptions related to user data.
 */
class UserDataException extends MoviebunkersException {
    /**
     * Constructor for UserDataException class.
     * @param message - Error message.
     * @param status - HTTP status code.
     * @param reason - Reason for the error.
     * @param stack - Stack trace for the error.
     */
    constructor(
        message: string,
        status?: HttpCodes | undefined,
        reason?: string | undefined,
        stack?: string | undefined
    ) {
        super(message, status, reason, stack);
        this.name = "UserDataException";
    }
}

export default UserDataException;
