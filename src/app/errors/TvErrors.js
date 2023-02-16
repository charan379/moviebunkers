const { HttpCodes } = require("../constants/HttpCodes");

/**
 * JoiInvalidTv Error
 * @param {String} info
 * @returns Error Object
 */
exports.JoiInvalidTv = (info) => {
  return {
    code: "TITLE_JIT",
    message: "Tv Object is not valid",
    reason: "Errors : " + info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};
