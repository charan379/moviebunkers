import HttpCodes from "../constants/http.codes.enum";

class MoviebunkersException extends Error {
  status?: HttpCodes | undefined;
  reason?: string;
  constructor(
    message: string,
    status?: HttpCodes | undefined,
    reason?: string | undefined,
    stack?: string | undefined
  ) {
    super(message);
    this.name = "MoviebunkersException";
    (this.status = status), (this.reason = reason), (this.stack = stack);
  }
}

export default MoviebunkersException;
