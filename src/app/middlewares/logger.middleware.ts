import { format, transports } from 'winston';
import expressWinston from 'express-winston';


export const ConsoleLogger = expressWinston.logger({
    transports: [new transports.Console()],
    format: format.combine(
        format.label({ label: 'moviebunkers' }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.json(),
        format.printf(
            ({ level, message, label, timestamp }) =>
                `${timestamp} [${label}] ${level}: ${message}`
        )
    ),
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
})