import HttpCodes from "../constants/http.codes.enum";

/**
 * Custom error class for Moviebunkers application.
 */
class RepositoryException extends Error {
  status?: HttpCodes | undefined;
  reason?: string;

  /**
   * Constructor for RepositoryException class.
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
    // Call the base Error class constructor with the message
    super(message);

    // Set the name of the error class
    this.name = "RepositoryException";

    // Set the status, reason, and stack properties if provided
    this.status = status;
    this.reason = reason;
    this.stack = stack;
  }
}

export default RepositoryException;
