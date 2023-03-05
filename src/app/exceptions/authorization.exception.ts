import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "./moviebunkers.exception";

class AuthorizationException extends MoviebunkersException {
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