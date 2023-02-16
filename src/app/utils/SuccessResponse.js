const { HttpCodes } = require("../constants/HttpCodes");

/**
 *
 * @param {SuccessObject}
 * @returns error response
 */
function SuccessResponse(result) {
  return {
    success: true,
    httpCode: HttpCodes.OK.code,
    result: result,
  };
}

module.exports = SuccessResponse;
