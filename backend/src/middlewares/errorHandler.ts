import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Non autorisé') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Accès refusé') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Ressource') {
        super(`${resource} introuvable`, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

// Gestionnaire d'erreurs centralisé
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    logger.error(`Error on ${req.method} ${req.path}:`, {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    // AppError
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // Erreurs de validation Zod
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Erreurs Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Cette valeur existe déjà',
                field: (err.meta?.target as string[])?.join(', '),
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Enregistrement introuvable',
            });
            return;
        }
    }

    // Erreur générique
    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Erreur interne du serveur',
    });
}
