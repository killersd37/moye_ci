import { Request, Response } from 'express';
import { authService } from './auth.service';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.schema';

export class AuthController {
    // POST /auth/register
    async register(req: Request, res: Response): Promise<void> {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data);

        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès. Bienvenue sur MOYÉ !',
            data: result,
        });
    }

    // POST /auth/login
    async login(req: Request, res: Response): Promise<void> {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);

        res.json({
            success: true,
            message: 'Connexion réussie. Akwaba !',
            data: result,
        });
    }

    // GET /auth/me
    async getMe(req: Request, res: Response): Promise<void> {
        const user = await authService.getMe(req.user!.userId);

        res.json({
            success: true,
            data: user,
        });
    }

    // PATCH /auth/me
    async updateProfile(req: Request, res: Response): Promise<void> {
        const data = updateProfileSchema.parse(req.body);
        const user = await authService.updateProfile(req.user!.userId, data);

        res.json({
            success: true,
            message: 'Profil mis à jour',
            data: user,
        });
    }
}

export const authController = new AuthController();
