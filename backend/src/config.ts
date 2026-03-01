import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
    return value;
}

function optional(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

export const config = {
    nodeEnv: optional('NODE_ENV', 'development'),
    port: parseInt(optional('PORT', '4000'), 10),
    apiPrefix: optional('API_PREFIX', '/api/v1'),

    // Database
    databaseUrl: required('DATABASE_URL'),

    // JWT
    jwtSecret: optional('JWT_SECRET', 'moye-secret-key-development'),
    jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
    jwtRefreshSecret: optional('JWT_REFRESH_SECRET', 'moye-refresh-secret-dev'),
    jwtRefreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '30d'),

    // CORS
    corsOrigin: optional('CORS_ORIGIN', 'http://localhost:3000'),

    // File Upload
    uploadDir: optional('UPLOAD_DIR', './uploads'),
    maxFileSize: optional('MAX_FILE_SIZE', '50mb'),

    // Rate Limiting
    rateLimitWindowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    rateLimitMax: parseInt(optional('RATE_LIMIT_MAX', '100'), 10),

    // IA
    geminiApiKey: optional('GEMINI_API_KEY', ''),

    // Ollama (La Lumière Moyé — local only)
    ollamaUrl: optional('OLLAMA_URL', 'http://host.docker.internal:11434'),
    ollamaModel: optional('OLLAMA_MODEL', 'llama3:8b'),

    // Logging
    logLevel: optional('LOG_LEVEL', 'debug'),
} as const;

export type Config = typeof config;
