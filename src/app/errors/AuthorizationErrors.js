const { HttpCodes } = require("../constants/HttpCodes");
/**
 * AuthTokenEmpty Error
 * @param {String} info 
 * @returns Error Object
 */
exports.AuthTokenEmpty = (info) => {
  return {
    code: "AUTH_ATE",
    message: "Invalid Token",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

/**
 * InvalidToken Error
 * @param {String} info 
 * @returns Error Object
 */
exports.InvalidToken = (info) => {
  return {
    code: "AUTH_IT",
    message: "Invalid Token",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

/**
 * ExpiredToken Error
 * @param {String} info 
 * @returns Error Object
 */
exports.ExpiredToken = (info) => {
  return {
    code: "AUTH_ET",
    message: "Authorization Expired",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

/**
 * AccessNotPermitted Error
 * @param {String} info 
 * @returns Error Object
 */
exports.AccessNotPermitted = (info) => {
  return {
    code: "AUTH_ANP",
    message: "Access level not permitted",
    reason: "This resource can't be accessed by user level : " + info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};
