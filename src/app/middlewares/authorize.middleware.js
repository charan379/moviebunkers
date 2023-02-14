const { authorizationlevel } = require("../constants/authorization.levels");
const { AccessNotPermitted } = require("../errors/AuthorizationErrors");
const ErrorResponse = require("../utils/ErrorResponse");
const {
  AuthorizationException,
  MovieBunkersException,
} = require("../utils/Exceptions");
const { verifyJwtToken } = require("../utils/jwt.token");

exports.authorize = (Role) => {
  return [
    async (req, res, next) => {
      try {
        //Authorization: 'Bearer TOKEN'
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
          throw new AuthorizationException("Token Not Provided");
        }

        let deCodedToken = await verifyJwtToken(token);

        if (
          !(authorizationlevel[deCodedToken.role] >= authorizationlevel[Role])
        ) {
          throw new AuthorizationException(
            AccessNotPermitted(deCodedToken.role)
          );
        }

        req.authentication = {
          ...deCodedToken,
        };
        next();
      } catch (error) {
        if (error instanceof MovieBunkersException) {
          return res.status(error.httpCode).json(ErrorResponse(error));
        }

        return res.status(500).json(ErrorResponse(error));
      }
    },
  ];
};
