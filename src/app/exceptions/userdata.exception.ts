import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

class UserDataException extends MoviebunkersException {
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
