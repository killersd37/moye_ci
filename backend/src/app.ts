import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import 'express-async-errors';

import { config } from './config';
import { logger } from './utils/logger';
import { AppError, errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import ethnieRoutes from './modules/ethnies/ethnie.routes';
import langueRoutes from './modules/pont/langue.routes';
import traductionRoutes from './modules/pont/traduction.routes';
import chatRoutes from './modules/pont/chat.routes';
import academieRoutes from './modules/academie/academie.routes';
import podcastRoutes from './modules/medias/podcast.routes';
import ongRoutes from './modules/medias/ong.routes';
import scannerRoutes from './modules/scanner/scanner.routes';
import moyeChatRoutes from './routes/chat.routes';

export function createApp(): Application {
    const app = express();

    // ============================================================
    // SECURITY MIDDLEWARES
    // ============================================================
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    app.use(cors({
        origin: config.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting global
    const limiter = rateLimit({
        windowMs: config.rateLimitWindowMs,
        max: config.rateLimitMax,
        message: { success: false, message: 'Trop de requêtes. Réessayez dans quelques minutes.' },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    // ============================================================
    // BODY PARSERS
    // ============================================================
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(compression());

    // ============================================================
    // STATIC FILES (uploads)
    // ============================================================
    app.use('/uploads', express.static(path.resolve(config.uploadDir)));

    // ============================================================
    // REQUEST LOGGING
    // ============================================================
    app.use((req: Request, _res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.path}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        });
        next();
    });

    // ============================================================
    // HEALTH CHECK
    // ============================================================
    app.get('/health', (_req: Request, res: Response) => {
        res.json({
            success: true,
            app: 'MOYÉ API',
            version: '1.0.0',
            status: 'running',
            timestamp: new Date().toISOString(),
            environment: config.nodeEnv,
        });
    });

    // ============================================================
    // API ROUTES
    // ============================================================
    const apiPrefix = config.apiPrefix;

    app.use(`${apiPrefix}/auth`, authRoutes);
    app.use(`${apiPrefix}/users`, userRoutes);
    app.use(`${apiPrefix}/ethnies`, ethnieRoutes);
    app.use(`${apiPrefix}/langues`, langueRoutes);
    app.use(`${apiPrefix}/traductions`, traductionRoutes);
    app.use(`${apiPrefix}/chat`, chatRoutes);
    app.use(`${apiPrefix}/academie`, academieRoutes);
    app.use(`${apiPrefix}/podcasts`, podcastRoutes);
    app.use(`${apiPrefix}/ongs`, ongRoutes);
    app.use(`${apiPrefix}/scanner`, scannerRoutes);
    app.use(`${apiPrefix}/moye`, moyeChatRoutes);

    // ============================================================
    // ERROR HANDLERS
    // ============================================================
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
