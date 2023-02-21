const joi2swagger = require("joi-to-swagger");
const { movieSchema } = require("../validators/movie.validator");
const { tvSchema } = require("../validators/tv.validator");
const { newUserSchema, loginSchema, userUpdateSchema } = require("../validators/user.validator");

const swaggerSchemas = {
  newUser: joi2swagger(newUserSchema).swagger,
  login: joi2swagger(loginSchema).swagger,
  movieSchema: joi2swagger(movieSchema).swagger,
  tvSchema: joi2swagger(tvSchema).swagger,
  userUpdateSchema: joi2swagger(userUpdateSchema).swagger,
};

module.exports = swaggerSchemas;
