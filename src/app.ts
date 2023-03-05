import "reflect-metadata";
import createHttpError from "http-errors";
import express, { Application } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import stylus from "stylus";
import webRouter from '@routes/pug.routes'
import apiRouter from '@routes/api.routes'
import ErrorHandler from "@middlewares/errorHandler.middleware";
import { ConsoleLogger } from "@middlewares/logger.middleware";
import { swaggerDocs } from "./app/swagger/swagger.options";
import swaggerUi from 'swagger-ui-express';
import Config from "@Config";

const app: Application = express();

// set app environment
app.set("env", Config.NODE_ENV);

// view engine setup
app.set("views", path.join(__dirname, "/app/views"));
app.set("view engine", "pug");
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("cookieSecretHere"));
app.use(stylus.middleware(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public")));

app.use(ConsoleLogger);

// swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', webRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // res.status(404).json({message: "Route not found"})
  next(createHttpError(404));
});

// error handler ( default handler provided by Express if we are not handling error then it will catch errors by default)
app.use(ErrorHandler);

export default app;
