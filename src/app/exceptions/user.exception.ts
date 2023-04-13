import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * Custom error class for user-related errors in a Moviebunkers application.
 */
class UserException extends MoviebunkersException {
  /**
   * Constructor for UserException class.
   * @param {string} message - Error message.
   * @param {HttpCodes} [status] - HTTP status code.
   * @param {string} [reason] - Reason for the error.
   * @param {string} [stack] - Stack trace for the error.
   */
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
