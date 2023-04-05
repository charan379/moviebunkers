import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

/**
 * Returns an error response object.
 * @param {Object} error - The error object.
 * @param {MoviebunkersException} options.error - The error object.
 * @returns {Object} - The error response object.
 */
function ErrorResponse({ error }: { error: MoviebunkersException | undefined }) {
  return {
    success: false,
    error: {
      name: error?.name ?? 'Unknown Error',
      status: error?.status ?? HttpCodes.INTERNAL_SERVER_ERROR,
      message: error?.message ?? "empty message",
      reason: error?.reason ?? "empty reason",
    },
  };
}

export default ErrorResponse;
