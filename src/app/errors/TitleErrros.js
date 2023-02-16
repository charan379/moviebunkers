const { HttpCodes } = require("../constants/HttpCodes");

/**
 * TitleNotFound Error
 * @param {String} info
 * @returns Error Object
 */
exports.TitleNotFound = (info) => {
  return {
    code: "TITLE_TNF",
    message: "No Titles Found ",
    reason: "Query : " + info,
    httpCode: HttpCodes.OK.code,
  };
};

/**
 * TitleAlreadyExists Error
 * @param {String} info
 * @returns Error Object
 */
exports.TitleAlreadyExists = (info) => {
  return {
    code: "TITLE_TAE",
    message: "Title already exists can't create new one",
    reason: info,
    httpCode: HttpCodes.OK.code,
  };
};

/**
 * InvalidTitleType Error
 * @param {String} info
 * @returns Error Object
 */
exports.InvalidTitleType = (info) => {
  return {
    code: "TITLE_IVTT",
    message: "Given title_type is invalid title_type must be 'tv' or 'movie' ",
    reason: "Invalid title_type : " + info,
    httpCode: HttpCodes.BAD_REQUEST.code,
  };
};
