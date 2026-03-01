import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    pseudo: z
        .string()
        .min(3, 'Le pseudo doit contenir au moins 3 caractères')
        .max(30, 'Le pseudo ne peut pas dépasser 30 caractères')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Le pseudo ne peut contenir que des lettres, chiffres, _ ou -'),
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});

export const updateProfileSchema = z.object({
    pseudo: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_-]+$/)
        .optional(),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
