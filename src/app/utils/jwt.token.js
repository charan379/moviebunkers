const jwt = require("jsonwebtoken");
const { InvalidToken, ExpiredToken } = require("../errors/AuthorizationErrors");
const { AuthorizationException } = require("./Exceptions");

/**
 * generateJwtToken
 * @param {Object} userObj
 * @returns
 */
exports.generateJwtToken = async (userObj) => {
  let token;
  try {
    token = jwt.sign({ ...userObj }, "secretkeyappearshere", {
      expiresIn: "1h",
    });
  } catch (error) {
    throw new Error("Error! Something went wrong. With Generating Token");
  }

  return token;
};

/**
 * verifyJwtToken
 * @param {JwtToken} token
 * @returns
 */
exports.verifyJwtToken = async (token) => {
  let deCodedToken;
  try {
    deCodedToken = jwt.verify(token, "secretkeyappearshere");
  } catch (error) {
    if (error.message === "invalid token") {
      throw new AuthorizationException(InvalidToken(error.message));
    }
    if (error.message === "jwt expired") {
      throw new AuthorizationException(ExpiredToken(error.message));
    }

    throw new Error(error);
  }

  return deCodedToken;
};
