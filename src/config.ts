require("dotenv").config();

const Config = Object.freeze({
  PORT: process.env.PORT || 3000,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  MongoDB_SERVER_STRING: process.env.MongoDB_SERVER_STRING,
  HTTPS: process.env.HTTPS === "true" ? true : false,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin)
    : [],
  NODE_ENV: process.env?.NODE_ENV ?? "development"
});

export default Config;