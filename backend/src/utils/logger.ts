import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const isDev = config.nodeEnv === 'development';

export const logger = winston.createLogger({
    level: config.logLevel,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: 'moye-api' },
    transports: [
        // Console (colorisé en dev)
        new winston.transports.Console({
            format: isDev
                ? combine(colorize(), simple())
                : combine(timestamp(), json()),
        }),
        // Fichier logs erreurs
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
        }),
        // Fichier logs combiné
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 10,
        }),
    ],
});
