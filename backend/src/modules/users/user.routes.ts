import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';
import { qs, qn } from '../../utils/helpers';

const router = Router();

// GET /users?page=1&limit=20 (Admin)
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    const page = qn(req.query.page, 1)!;
    const limit = qn(req.query.limit, 20)!;
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true, email: true, pseudo: true, role: true,
                moyeOrPoints: true, streakDays: true, isActive: true,
                createdAt: true, lastName: true, firstName: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    res.json({
        success: true,
        data: users,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
});

// GET /users/:id/profile (public)
router.get('/:id/profile', async (req, res) => {
    const userId = qs(req.params.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, pseudo: true, avatar: true, role: true,
            moyeOrPoints: true, streakDays: true, createdAt: true,
            badges: { include: { badge: true }, orderBy: { obtenuLe: 'desc' } },
        },
    });
    if (!user) throw new NotFoundError('Utilisateur');
    res.json({ success: true, data: user });
});

// GET /users/leaderboard (top 10)
router.get('/leaderboard', async (_req, res) => {
    const users = await prisma.user.findMany({
        where: { isActive: true },
        take: 10,
        orderBy: { moyeOrPoints: 'desc' },
        select: {
            id: true, pseudo: true, avatar: true,
            moyeOrPoints: true, streakDays: true, role: true,
        },
    });
    res.json({ success: true, data: users });
});

// PATCH /users/:id/toggle-active (Admin)
router.patch('/:id/toggle-active', authenticate, authorize('ADMIN'), async (req, res) => {
    const userId = qs(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('Utilisateur');

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        select: { id: true, pseudo: true, isActive: true },
    });

    res.json({ success: true, data: updated });
});

export default router;
