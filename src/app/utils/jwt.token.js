const jwt = require("jsonwebtoken");
const { Config } = require("../../config");
const { InvalidToken, ExpiredToken } = require("../errors/AuthorizationErrors");
const { AuthorizationException } = require("./Exceptions");

/**
 * generateJwtToken
 * @param {Object} userObj
 * @returns
 */
exports.generateJwtToken = async (userObj) => {
  let token;
  /**
   * try to create hwt token
   */
  try {
    /**
     * create new jwt token and store in token variable
     */
    token = jwt.sign({ ...userObj }, Config.JWT_SECRET, {
      expiresIn: "1d",
    });
    /**
     * catch if any error thrown by above process
     */
  } catch (error) {
    /**
     * throw error with below message
     */
    throw new Error("Error! Something went wrong. With Generating Token");
  }

  /**
   * If no errors were thrown then return signed jwt token
   */
  return token;
};

/**
 * verifyJwtToken
 * @param {JwtToken} token
 * @returns
 */
exports.verifyJwtToken = async (token) => {
  let deCodedToken;
  /**
   * try to verify jwt token
   */
  try {
    /**
     * verify jwt token and store it in deCodedToken variable
     */
    deCodedToken = jwt.verify(token, Config.JWT_SECRET);

    /**
     * catch if any error is thrown by above process
     */
  } catch (error) {
    console.log(error.message)
    /**
     * if thrown error is " invalid signature "
     */
    if (error.message === "invalid signature") {
      throw new AuthorizationException(InvalidToken(error.message));
    }

    /**
     * if thrown error is " invalid token "
     */
    if (error.message === "invalid token") {
      throw new AuthorizationException(InvalidToken(error.message));
    }

    /**
     * if thrown error is " jwt expired "
     */
    if (error.message === "jwt expired") {
      throw new AuthorizationException(ExpiredToken(error.message));
    }
    
    /**
     * If any other error is thrown 
     */
    throw new Error(error);
  }

  /**
   * if no errors are thrown than return de-coded token details
   */
  return deCodedToken;
};
