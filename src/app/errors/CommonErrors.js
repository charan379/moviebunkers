const { HttpCodes } = require("../constants/HttpCodes");

/**
 * 404 NotFound Error
 * @param {String} info
 * @returns Error Object
 */
exports.NotFound404 = (info) => {
  return {
    code: "COM_NF404",
    message: "Requested Endpoint doesn't exit",
    reason: "End Point : " + info,
    httpCode: HttpCodes.NOT_FOUND.code,
  };
};

/**
 * InvalidQuery Error
 * @param {String} info
 * @returns Error Object
 */
exports.InvalidQuery = (info) => {
  return {
    code: "COM_IQ",
    message: "Request query is invalid",
    reason: "erros : " + info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};
