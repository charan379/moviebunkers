const { HttpCodes } = require("../constants/HttpCodes");

/**
 * JoiInvalidMovie Error
 * @param {String} info
 * @returns Error Object
 */
exports.InternalServerError = (info) => {
    return {
      code: "ISE",
      message: "Somthing Went Wrong",
      reason: "Errors : " + info,
      httpCode: HttpCodes.INTERNAL_SERVER_ERROR.code,
    };
  };