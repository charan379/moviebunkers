const titlesService = require("../service/titles.service");
const ErrorResponse = require("../utils/ErrorResponse");
const { MovieBunkersException } = require("../utils/Exceptions");
const SuccessResponse = require("../utils/SuccessResponse");

/**
 * newTitle create new title
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.newTitle = async (req, res, next) => {
  /**
   * try to create new title
   */
  try {
    /**
     * create new title
     * and
     * get _id, title, title_type from created title
     */
    const { _id, title, title_type } = await titlesService.newTitle(req.body, req.authentication);

    /**
     * respond with status code 200
     * and json body as response
     */
    res.status(201).json(SuccessResponse({ _id, title, title_type }));
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
 * getAllTitles
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 * @param {Function} next
 */
exports.getAllTitles = async (req, res, next) => {
  /**
   * try to get all titles
   */
  try {
    /**
     * get all titles and store it in variable titlesList
     */
    const titlesList = await titlesService.findAll(req.query);
    /**
     * respond with status code 200
     * and
     * response body in json format
     */
    res.status(200).json(SuccessResponse(titlesList));
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
