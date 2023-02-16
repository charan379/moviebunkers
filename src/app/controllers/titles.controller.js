const titlesService = require("../service/titles.service");
const ErrorResponse = require("../utils/ErrorResponse");
const { MovieBunkersException } = require("../utils/Exceptions");

exports.addNewMovie = async (req, res, next) => {
  try {
    const { _id, title, title_type } = await titlesService.newTitle(req.body);

    res.status(200).json({
      success: true,
      movie: {
        _id,
        title,
        title_type,
      },
    });
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