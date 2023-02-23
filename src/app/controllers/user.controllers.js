const { MovieBunkersException } = require("../utils/Exceptions");
const ErrorResponse = require("../utils/ErrorResponse");
const usersService = require("../service/users.service");
const SuccessResponse = require("../utils/SuccessResponse");
const { Config } = require("../../config");

/**
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.newUser = async (req, res, next) => {
  /**
   * try creating newUser
   */
  try {
    /**
     * destructure userObj into individual variables after creating new user
     */
    const { userName, email, role, status } = await usersService.newUser(
      req.body
    );
    /**
     * send HttpResponse with status code 200 and json obj
     */
    res
      .status(200) // HttpStatus code 200
      .json(SuccessResponse({ user: { userName, email, role, status } })); // Http Response in json formart
  } catch (error) {
    // catch if there was any error

    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of MovieBunkersException
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
 * get all users
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.getAllUsers = async (req, res, next) => {
  /**
   * try to find all users based on request
   */
  try {
    /**
     * get all users usign request query
     * and
     * store users in userList
     */
    const userList = await usersService.findAll(req.query);

    /**
     * respond with status code 200 and json response body
     */
    res.status(200).json(SuccessResponse(userList));
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of MovieBunkersException
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
 * update user
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.updateUser = async (req, res, next) => {
  /**
   * try to update user
   */
  try {
    /**
     * update user with username in request parameter and update object in request body
     * and stote update user details in a variable
     */
    const updatedUser = await usersService.updateUser(
      req.params.userName,
      req.body,
      req.authentication
    );

    /**
     * if no errors
     * respond with status code 200 and with json boby as response
     */
    res.status(200).json(SuccessResponse(updatedUser));
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of MovieBunkersException
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
exports.userLogin = async (req, res, next) => {
  /**
   * try to login with given credentials
   */
  try {
    /**
     * destructure user loginDetails into { userName, email, role, token } after login
     */
    const loginDetails = await usersService.userLogin(req.body);

    /**
     * send HttpResponse with status code 200 and json obj
     */
    res
      // send auth as cookie 
      .cookie("auth", `Bearer ${loginDetails.token}`, {
        maxAge: 90000000,
        httpOnly: true,
        secure: Config.HTTPS,
        signed: true,
        overwrite: true,
      })
      .status(200) // HttpCode 200
      .json(SuccessResponse(loginDetails)); // json body
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of MovieBunkersException
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

exports.getWhoAmI = async (req, res, next) => {
  /**
   * try to find user details
   */
  try {
    /**
     * get user details from repository
     */
    const userDetails = await usersService.findUserDetails(
      req.authentication.userName
    );
    /**
     * send HttpResponse with status code 200 and json obj
     */
    res
      .status(200) // HttpCode 200
      .json(SuccessResponse(userDetails)); // json body
  } catch (error) {
    // catch if there was any error
    if (error instanceof MovieBunkersException) {
      /**
       * if occurred error is an instance of MovieBunkersException
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
