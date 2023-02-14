const { HttpCodes } = require("../constants/HttpCodes");


/**
 * UserNameAlreadyExists Error
 * @param {String} info 
 * @returns Error Object
 */
exports.UserNameAlreadyExists = (info) => {
  return {
    code: "USER_UNAE",
    message: "User with same username already exits",
    reason: "Username : " + info,
    httpCode: HttpCodes.OK.code,
  };
};

/**
 * UserEmailAlreadyExists Error
 * @param {String} info 
 * @returns Error Object
 */
exports.UserEmailAlreadyExists = (info) => {
  return {
    code: "USER_UEAE",
    message: "User with same email already exits",
    reason: "email : " + info,
    httpCode: HttpCodes.OK.code,
  };
};

/**
 * UserNameNotFound Error
 * @param {String} info 
 * @returns Error Object
 */
exports.UserNameNotFound = (info) => {
  return {
    code: "USER_UNNF",
    message: "User Not Found",
    reason: "Invalid UserName : " + info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};

/**
 * InvalidUserPassword Error
 * @param {String} info 
 * @returns Error Object
 */
exports.InvalidUserPassword = (info) => {
  return {
    code: "USER_IUP",
    message: "Password Incorrect",
    reason: "Invalid Password for : " + info,
    httpCode: HttpCodes.OK.code,
  };
};

/**
 * JoiInvalidNewUser Error
 * @param {String} info 
 * @returns Error Object
 */
exports.JoiInvalidNewUser = (info) => {
  return {
    code: "USER_JOI_NEW",
    message: "Invalid New User Body",
    reason: info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};

/**
 * JoiInvalidLogin Error
 * @param {String} info 
 * @returns Error Object
 */
exports.JoiInvalidLogin = (info) => {
  return {
    code: "USER_JOI_LOGIN",
    message: "Invalid User Body",
    reason: info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};
