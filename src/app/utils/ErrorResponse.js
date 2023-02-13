function ErrorResponse(errorCode, errorMessage) {
  return {
    success: false,
    code: errorCode,
    errorMessage: errorMessage,
  };
}



module.exports = ErrorResponse;