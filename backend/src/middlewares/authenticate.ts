import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { UnauthorizedError, ForbiddenError } from './errorHandler';
import { Role } from '@prisma/client';

export interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
}

// Étend le type Request d'Express
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// Middleware d'authentification (vérifie le JWT)
export async function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token d\'authentification manquant');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

        // Vérifier que l'utilisateur existe toujours et est actif
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, isActive: true },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedError('Compte non trouvé ou désactivé');
        }

        req.user = payload;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expiré');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError('Token invalide');
        }
        throw error;
    }
}

// Middleware d'autorisation par rôle
export function authorize(...roles: Role[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new UnauthorizedError();
        }

        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Vous n\'avez pas les droits nécessaires');
        }

        next();
    };
}

// Middleware optionnel (ne bloque pas si pas de token)
export async function optionalAuthenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.user = payload;
    } catch {
        // Ignore les erreurs de token optionnel
    }

    next();
}
