import MoviebunkersException from "@exceptions/moviebunkers.exception";
import ErrorResponse from "@utils/ErrorResponse";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import WinstonLogger from "./winstonlogger.middleware";


const ErrorHandler: ErrorRequestHandler = (error: HttpError | Error | MoviebunkersException, req: Request, res: Response, next: NextFunction) => {


    // set locals, only providing error in development
    res.locals.message = error.message;
    res.locals.error = req.app.get("env") === "development" ? error : {};

    // render the error page
    if (error instanceof HttpError) {
        WinstonLogger.warn(error)
        res.status(error?.status || 500);
        res.json(ErrorResponse({ error }))
    } else if (error instanceof MoviebunkersException) {
        WinstonLogger.warn(error)
        res.status(error?.status ?? 500);
        res.json(ErrorResponse({ error }));
    } else {
        WinstonLogger.error(error)
        res.status(500)
        res.json(ErrorResponse({ error }))
    }

}

export default ErrorHandler;