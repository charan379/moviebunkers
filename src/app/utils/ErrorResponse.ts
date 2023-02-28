import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";


/**
 * 
 * @param {ErrorObject} error 
 * @returns error response
 */
function ErrorResponse(error:  MoviebunkersException) {
  return {
    success: false,
    error: {
      name: error?.name ?? 'Unknown Error',
      status: error?.status ?? HttpCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      reason: error?.reason,
      stack: error?.stack
    },
  };
}

export default ErrorResponse;