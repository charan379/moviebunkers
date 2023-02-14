/**
 * MovieBunkersException
 */
class MovieBunkersException extends Error {
  constructor(errorObject) {
    super(errorObject.message);
    this.name = "MovieBunkersException";
    this.code = errorObject.code;
    this.reason = errorObject.reason;
    this.httpCode = errorObject.httpCode;
  }
}

/**
 * UserException
 */
class UserException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "UserException";
  }
}

/**
 * AuthorizationException
 */
class AuthorizationException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "AuthorizationException";
  }
}

/**
 * exports
 */
module.exports = {
  MovieBunkersException,
  UserException,
  AuthorizationException,
};
