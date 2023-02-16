const { HttpCodes } = require("../constants/HttpCodes");

/**
 * JoiInvalidMovie Error
 * @param {String} info
 * @returns Error Object
 */
exports.JoiInvalidMovie = (info) => {
  return {
    code: "TITLE_JIM",
    message: "Movie Object is not valid",
    reason: "Errors : " + info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};
