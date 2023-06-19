import HttpCodes from "../constants/http.codes.enum";
import MoviebunkersException from "./moviebunkers.exception";

/**
 * Custom error class for Moviebunkers application.
 */
class EmailExecption extends MoviebunkersException {
  status?: HttpCodes | undefined;
  reason?: string;

  /**
   * Constructor for EmailExecption class.
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
    this.name = "EmailExecption";
  }
}

export default EmailExecption;
