import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

class UserException extends MoviebunkersException {
  constructor(
    message: string,
    status?: HttpCodes | undefined,
    reason?: string | undefined,
    stack?: string | undefined
  ) {
    super(message, status, reason, stack);
    this.name = "UserException";
  }
}

export default UserException;
