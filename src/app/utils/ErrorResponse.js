/**
 * 
 * @param {ErrorObject} error 
 * @returns error response
 */
function ErrorResponse(error) {
  return {
    success: false,
    error: {
      name: error.name,
      code: error.code,
      httpCode: error.httpCode,
      message: error.message,
      reason: error.reason,
    },
  };
}

module.exports = ErrorResponse;
