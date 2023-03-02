import { createLogger, format, transports } from 'winston';

const WinstonLogger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'moviebunkers' },
    transports: [
      new transports.File({
        filename: 'logs/app.logs.json',
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.errors({ stack: true }),
          format.splat(),
          format.json({ space: 2 })
        ),
      }),
      new transports.Console({
        format: format.combine(
          format.label({ label: 'moviebunkers' }),
          format.colorize(),
          format.printf(
            ({ level, message, label, timestamp, name, reason }) =>
              `${timestamp} [${label}] ${level}: ${message} : ${name?? "Unknown"} : ${reason?? "Unknown"}`
          )
        ),
      }),
    ],
  });
  

  export default WinstonLogger;