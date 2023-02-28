import { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import debugLogger from "debug";

@Middleware({ type: 'after' })
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  debug = debugLogger("moviebunkers:[app.ts");
  use(request: Request, response: Response, next: NextFunction): void {
    this.debug(request.path);
    next();
  }
}