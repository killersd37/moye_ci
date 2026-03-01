import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';
import { z } from 'zod';

const router = Router();

const messageSchema = z.object({
    contenu: z.string().min(1).max(2000),
    langueCode: z.string().default('fr'),
    canalId: z.string().min(1),
});

// GET /chat/canaux
router.get('/canaux', async (_req, res) => {
    const canaux = await prisma.canalDiscussion.findMany({
        where: { isActive: true },
        include: {
            _count: { select: { messages: true } },
        },
        orderBy: { nom: 'asc' },
    });
    res.json({ success: true, data: canaux });
});

// GET /chat/canaux/:slug/messages
router.get('/canaux/:slug/messages', async (req, res) => {
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const canal = await prisma.canalDiscussion.findUnique({
        where: { slug: req.params.slug },
    });
    if (!canal) throw new NotFoundError('Canal');

    const [total, messages] = await Promise.all([
        prisma.message.count({ where: { canalId: canal.id } }),
        prisma.message.findMany({
            where: { canalId: canal.id },
            skip,
            take: parseInt(limit as string),
            include: {
                user: { select: { id: true, pseudo: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    res.json({
        success: true,
        data: messages.reverse(),
        meta: { total, page: parseInt(page as string) },
    });
});

// POST /chat/messages - Envoyer un message
router.post('/messages', authenticate, async (req, res) => {
    const { contenu, langueCode, canalId } = messageSchema.parse(req.body);

    const canal = await prisma.canalDiscussion.findUnique({ where: { id: canalId } });
    if (!canal) throw new NotFoundError('Canal');

    // Translittération automatique simple (mock)
    const traductionsAuto: Record<string, string> = {};
    if (langueCode !== 'fr') {
        traductionsAuto['fr'] = `[Traduit depuis ${langueCode}]: ${contenu}`;
    }

    const message = await prisma.message.create({
        data: {
            contenu,
            langueCode,
            traductions: Object.keys(traductionsAuto).length > 0 ? traductionsAuto : undefined,
            userId: req.user!.userId,
            canalId,
        },
        include: {
            user: { select: { id: true, pseudo: true, avatar: true } },
            canal: { select: { nom: true, slug: true } },
        },
    });

    res.status(201).json({
        success: true,
        message: 'Message envoyé',
        data: message,
    });
});

// GET /chat/canaux - Créer un canal (Admin)
router.post('/canaux', authenticate, async (req, res) => {
    const { nom, description } = req.body;
    const slug = nom.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const canal = await prisma.canalDiscussion.create({
        data: { nom, description, slug },
    });

    res.status(201).json({ success: true, data: canal });
});

export default router;
