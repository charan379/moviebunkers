const { authorizationlevel } = require("../constants/authorization.levels");
const { AccessNotPermitted } = require("../errors/AuthorizationErrors");
const ErrorResponse = require("../utils/ErrorResponse");
const {
  AuthorizationException,
  MovieBunkersException,
} = require("../utils/Exceptions");
const { verifyJwtToken } = require("../utils/jwt.token");

/**
 * authorize route
 * @param {PermitedRole} Role
 * @returns throws error if not authorized else add's user details to req and goes to next function in pipeline
 */
exports.authorize = (Role) => {
  return [
    /**
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Function} next
     * @returns http response or throws Exception
     */
    async (req, res, next) => {
      /**
       * try checking jwt token signature
       */
      try {
        //Authorization: 'Bearer TOKEN'
        const token = req.headers.authorization.split(" ")[1];

        /**
         * if token is empty or not provided throw error
         */
        if (!token) {
          throw new AuthorizationException("Token Not Provided");
        }

        /**
         * verifyJwtToken and store deCodedToken details
         */
        let deCodedToken = await verifyJwtToken(token);

        /**
         * if user access level is less then required access level for this route throw exception
         */
        if (
          !(authorizationlevel[deCodedToken.role] >= authorizationlevel[Role])
        ) {
          /**
           * new AuthorizationException
           */
          throw new AuthorizationException(
            AccessNotPermitted(deCodedToken.role) // AccessNotPermitted Error
          );
        }

        /**
         * add user details to request as object named authentication
         * so, these deatils can be used by next function in pipeline
         */
        req.authentication = {
          ...deCodedToken,
        };
        /**
         * invoke next function in pipeline
         */
        next();
        /**
         * catch if any error is thrown
         */
      } catch (error) {
        /**
         * if thrown error is an instance of MovieBunkersException
         */
        if (error instanceof MovieBunkersException) {
          /**
           * send http ErrorResponse
           */
          return res.status(error.httpCode).json(ErrorResponse(error));
        }

        /**
         * if any other error is thrown then send below http Error Response
         */
        return res.status(500).json(ErrorResponse(error));
      }
    },
  ];
};
