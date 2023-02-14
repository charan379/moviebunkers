class MovieBunkersException extends Error {
  constructor(errorObject) {
    super(errorObject.message);
    this.name = "MovieBunkersException";
    this.code = errorObject.code;
    this.reason = errorObject.reason;
    this.httpCode = errorObject.httpCode;
  }
}

class UserException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "UserException";
  }
}

class AuthorizationException extends MovieBunkersException {
  constructor(errorObject) {
    super(errorObject);
    this.name = "AuthorizationException";
  }
}

module.exports = {
  MovieBunkersException,
  UserException,
  AuthorizationException,
};
