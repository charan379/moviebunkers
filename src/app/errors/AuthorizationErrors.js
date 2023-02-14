const { HttpCodes } = require("../constants/HttpCodes");

exports.AuthTokenEmpty = (info) => {
  return {
    code: "AUTH_ATE",
    message: "Invalid Token",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

exports.InvalidToken = (info) => {
  return {
    code: "AUTH_IT",
    message: "Invalid Token",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

exports.ExpiredToken = (info) => {
  return {
    code: "AUTH_ET",
    message: "Authorization Expired",
    reason: info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};

exports.AccessNotPermitted = (info) => {
  return {
    code: "AUTH_ANP",
    message: "Access level not permitted",
    reason: "This resource can't be accessed by user level : " + info,
    httpCode: HttpCodes.UNATHORIZED.code,
  };
};
