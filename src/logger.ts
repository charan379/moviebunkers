import debug from "debug";
import { NextFunction } from "express";

export function loggerCustom (req: any, res: any, next: NextFunction) {
    const logger = debug('moviebunkers:[logger]')
    logger('logger middle ware working')
    next();
}