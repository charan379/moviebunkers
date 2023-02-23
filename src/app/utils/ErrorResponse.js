const { HttpCodes } = require("../constants/HttpCodes");

/**
 * 
 * @param {ErrorObject} error 
 * @returns error response
 */
function ErrorResponse(error) {
  return {
    success: false,
    httpCode: error.httpCode,
    error: {
      name: error.name || 'Unknown Error',
      code: error.code || HttpCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      reason: error.reason,
    },
  };
}

module.exports = ErrorResponse;
