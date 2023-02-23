require("dotenv").config();

exports.Config = Object.freeze({
  MongoDB_SERVER_STRING: process.env.MongoDB_SERVER_STRING,
  HTTPS: JSON.parse(process.env.HTTPS || false),
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
});
