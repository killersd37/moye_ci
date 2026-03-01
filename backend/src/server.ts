import 'dotenv/config';
import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './utils/prisma';

async function main() {
    try {
        await prisma.$connect();
        logger.info('✅ Connexion PostgreSQL établie');
    } catch (error) {
        logger.warn('⚠️ PostgreSQL indisponible — le serveur démarre sans base. Démarrez PostgreSQL (port 5432) ou utilisez Docker pour le contexte RAG.');
    }

    const app = createApp();

    const server = app.listen(config.port, () => {
        logger.info(`
╔══════════════════════════════════════════════╗
║          🌍 MOYÉ API - DÉMARRÉ               ║
╠══════════════════════════════════════════════╣
║  Port    : ${config.port}                           ║
║  Env     : ${config.nodeEnv}                  ║
║  API     : http://localhost:${config.port}${config.apiPrefix} ║
║  Health  : http://localhost:${config.port}/health   ║
╚══════════════════════════════════════════════╝
    `);
    });

    server.timeout = 300000;
    server.keepAliveTimeout = 310000;
    server.headersTimeout = 310000;

    // Graceful shutdown
    const shutdown = async (signal: string) => {
        logger.info(`Signal ${signal} reçu. Arrêt gracieux...`);
        server.close(async () => {
            try {
                await prisma.$disconnect();
            } catch (_) {}
            logger.info('Serveur arrêté proprement.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled Rejection:', reason);
        process.exit(1);
    });

    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', error);
        process.exit(1);
    });
}

main();
