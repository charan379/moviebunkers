import "reflect-metadata";
import createHttpError, { HttpError } from "http-errors";
import debugLogger from "debug";
import express, { application, Application, NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import stylus from "stylus";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import ErrorResponse from "./app/utils/ErrorResponse";
import webRouter from '@routes/pug.routes'
import apiRouter from '@routes/api.routes'

const debug = debugLogger("moviebunkers:[app.ts");

const app: Application = express();


// set app environment
app.set("env", "development");

// view engine setup
app.set("views", path.join(__dirname, "/app/views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public")));


app.use('/', webRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler ( default handler provided by Express if we are not handling error then it will catch errors by default)
app.use(function (
  err: HttpError | Error | MoviebunkersException,
  req: Request | any,
  res: Response | any,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  debug(err);

  // render the error page
  if (err instanceof HttpError) {
    res.status(err?.status || 500);
    res.json(ErrorResponse(err))
  } else if (err instanceof MoviebunkersException) {
    res.status(err?.status ?? 500);
    res.json(ErrorResponse(err));
  } else {
    res.status(500)
    res.json(ErrorResponse(err))
  }

});

export default app;
