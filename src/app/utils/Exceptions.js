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
 * TitleException
 */
class TitleException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "TitleException";
  }
}

/**
 * MovieException
 */
class MovieException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "MovieException";
  }
}

/**
 * TvException
 */
class TvException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "TvException";
  }
}

/**
 * exports
 */
module.exports = {
  MovieBunkersException,
  UserException,
  AuthorizationException,
  TitleException,
  MovieException,
  TvException,
};
