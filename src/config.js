require("dotenv").config();

exports.Config = Object.freeze({
  PORT: process.env.PORT || 3000,
  MongoDB_SERVER_STRING: process.env.MongoDB_SERVER_STRING,
  HTTPS: JSON.parse(process.env.HTTPS || false),
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin)
    : [],
});
