class UserException extends Error {
  constructor(message, errorCode, httpCode) {
    super(message);
    this.name = 'UserException';
    this.errorCode = errorCode;
    this.httpCode = httpCode;
  }
}


module.exports = {UserException};