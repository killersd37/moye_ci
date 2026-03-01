import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/prisma';
import { config } from '../../config';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../middlewares/errorHandler';
import { RegisterInput, LoginInput, UpdateProfileInput } from './auth.schema';

export class AuthService {
    // Inscription
    async register(data: RegisterInput) {
        // Vérifier unicité email
        const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingEmail) throw new ConflictError('Cet email est déjà utilisé');

        // Vérifier unicité pseudo
        const existingPseudo = await prisma.user.findUnique({ where: { pseudo: data.pseudo } });
        if (existingPseudo) throw new ConflictError('Ce pseudo est déjà pris');

        // Hacher le mot de passe
        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                pseudo: data.pseudo,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                pseudo: true,
                firstName: true,
                lastName: true,
                role: true,
                moyeOrPoints: true,
                createdAt: true,
            },
        });

        const tokens = this.generateTokens(user.id, user.email, user.role);

        return { user, ...tokens };
    }

    // Connexion
    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedError('Email ou mot de passe incorrect');
        }

        const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!passwordMatch) {
            throw new UnauthorizedError('Email ou mot de passe incorrect');
        }

        // Mettre à jour lastActiveAt
        await prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() },
        });

        const tokens = this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                pseudo: user.pseudo,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                moyeOrPoints: user.moyeOrPoints,
                streakDays: user.streakDays,
                avatar: user.avatar,
            },
            ...tokens,
        };
    }

    // Profil actuel
    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                pseudo: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                moyeOrPoints: true,
                streakDays: true,
                lastActiveAt: true,
                createdAt: true,
                badges: {
                    include: { badge: true },
                    orderBy: { obtenuLe: 'desc' },
                    take: 5,
                },
            },
        });

        if (!user) throw new NotFoundError('Utilisateur');
        return user;
    }

    // Mise à jour profil
    async updateProfile(userId: string, data: UpdateProfileInput) {
        if (data.pseudo) {
            const existing = await prisma.user.findUnique({ where: { pseudo: data.pseudo } });
            if (existing && existing.id !== userId) {
                throw new ConflictError('Ce pseudo est déjà pris');
            }
        }

        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                pseudo: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                moyeOrPoints: true,
            },
        });
    }

    // Générer les tokens JWT
    private generateTokens(userId: string, email: string, role: string) {
        const payload = { userId, email, role };

        const accessToken = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn as any,
        });

        const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
            expiresIn: config.jwtRefreshExpiresIn as any,
        });

        return { accessToken, refreshToken };
    }
}

export const authService = new AuthService();
