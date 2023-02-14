const { MovieBunkersException } = require("../utils/Exceptions");
const ErrorResponse = require("../utils/ErrorResponse");
const {
  newUserService,
  userLoginService,
} = require("../service/users.service");

/**
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.newUserController = async (req, res, next) => {
  /**
   * try creating newUser
   */
  try {
    /**
     * destructure userObj into {_id, userName, email, role } after creating new user
     */
    const { _id, userName, email, role } = await newUserService(req.body);
    /**
     * send HttpResponse with status code 200 and json obj in format of
     * {
     *  success : true,
     *  user: {
     *      _id: new ObjectId,
     *      userName: new userName,
     *      email: new email,
     *      role: user role,
     *        }
     * }
     */
    res
      .status(200) // HttpStatus code 200
      .json({ success: true, user: { _id, userName, email, role } }); // Http Response in json formart
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of UserException
       *
       *  */
      res
        .status(error.httpCode) // HttpStatus code
        .json(ErrorResponse(error)); // Http Response in json format
    } else {
      /**
       * if any other error is occurred then
       */
      res
        .status(500) // HttpStatus code 500
        .json(ErrorResponse(error)); // Http Response in json format
    }
  }
};

/**
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.userLoginController = async (req, res, next) => {
  /**
   * try to login with given credentials
   */
  try {
    /**
     * destructure user loginDetails into { userName, email, role, token } after login
     */
    const { userName, email, role, token } = await userLoginService(req.body);

    /**
     * send HttpResponse with status code 200 and json obj in format of
     * {
     *  success : true,
     *  loginDetails: {
     *      userName: new userName,
     *      email: new email,
     *      role: user role,
     *      token: jwt-token
     *                 }
     * }
     */
    res
      .status(200) // HttpCode 200
      // .json({ success: true, loginDetails: { userName, email, role, token } }); // HttpResponse in json format
      .json({
        success: true,
        token: token,
        userDetails: { userName, email, role },
      });
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of UserException
       *
       *  */
      res
        .status(error.httpCode) // HttpStatus code
        .json(ErrorResponse(error)); // Http Response in json format
    } else {
      /**
       * if any other error is occurred then
       */
      res
        .status(500) // HttpStatus code 500
        .json(ErrorResponse(error)); // Http Response in json format
    }
  }
};

/**
 * test
 */

exports.testToken = async (req, res, next) => {
  res.status(200).json({ ...req.authentication });
};
