const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const stylus = require("stylus");
const indexRouter = require("./app/routes/index");
const usersRouter = require("./app/routes/users.router");
const titlesRouter = require("./app/routes/titles.router");
const establishDbConnection = require("./app/utils/db");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

// db connection
establishDbConnection();

// view engine setup
app.set("views", path.join(__dirname, "./app/views"));
app.set("view engine", "pug");


// swagger API Documentation

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "moviebunkers",
      description:
        "moviebunkers app server",
      version: "1.0.0",
      contact: {
        name: "charan379",
        url: "#",
      },
      license: {
        name: "GNU Affero General Public License",
        url: "https://www.gnu.org/licenses/agpl-3.0.en.html",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: [path.join(process.cwd(),"./src/app/routes/*.js")],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/titles", titlesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
