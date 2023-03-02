import MoviebunkersException from "@exceptions/moviebunkers.exception";
import ErrorResponse from "@utils/ErrorResponse";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import WinstonLogger from "./winstonlogger.middleware";


const ErrorHandler: ErrorRequestHandler = (err: HttpError | Error | MoviebunkersException,req: Request,res: Response,next: NextFunction) => {
    
    
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    if (err instanceof HttpError) {
        WinstonLogger.warn(err)
        res.status(err?.status || 500);
        res.json(ErrorResponse(err))
    } else if (err instanceof MoviebunkersException) {
        WinstonLogger.warn(err)
        res.status(err?.status ?? 500);
        res.json(ErrorResponse(err));
    } else {
        WinstonLogger.error(err)
        res.status(500)
        res.json(ErrorResponse(err))
    }

}

export default ErrorHandler;