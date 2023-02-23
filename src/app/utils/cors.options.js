const { Config } = require("../../config");

const allowedOrigins = Config.CORS_ORIGINS;
const CorsOptions = {
  // exposedHeaders: ["*",'Authorization','Access-Control-Allow-Credentials','Access-Control-Expose-Headers','Access-Control-Allow-Origin',],
  exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "Cookie"],
  maxAge: 600,
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

module.exports = CorsOptions;
