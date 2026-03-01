import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { uploadAudio, uploadImage } from '../../middlewares/upload';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';
import { qs, qn } from '../../utils/helpers';
import path from 'path';

const router = Router();

// GET /podcasts
router.get('/', async (req, res) => {
    const page = qn(req.query.page, 1)!;
    const limit = qn(req.query.limit, 12)!;
    const skip = (page - 1) * limit;
    const langue = qs(req.query.langue);
    const search = qs(req.query.search);

    const where: any = { isPublished: true };
    if (langue) where.langue = langue;
    if (search) where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, podcasts] = await Promise.all([
        prisma.podcast.count({ where }),
        prisma.podcast.findMany({
            where,
            skip,
            take: limit,
            include: { auteur: { select: { id: true, pseudo: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    res.json({
        success: true,
        data: podcasts,
        meta: { total, page },
    });
});

// GET /podcasts/:id
router.get('/:id', async (req, res) => {
    const podcastId = qs(req.params.id);
    const podcast = await prisma.podcast.findUnique({
        where: { id: podcastId },
        include: { auteur: { select: { pseudo: true, avatar: true } } },
    });
    if (!podcast) throw new NotFoundError('Podcast');

    // Incrémenter le compteur de vues
    await prisma.podcast.update({ where: { id: podcastId }, data: { views: { increment: 1 } } });

    res.json({ success: true, data: podcast });
});

// POST /podcasts - Upload podcast (authentifié)
router.post('/', authenticate, uploadAudio.single('audio'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'Fichier audio requis' });
        return;
    }

    const { titre, description, tags, langue } = req.body;
    const audioUrl = `/uploads/audio/${req.file.filename}`;

    const podcast = await prisma.podcast.create({
        data: {
            titre,
            description,
            audioUrl,
            tags: tags ? JSON.parse(tags) : [],
            langue: langue || 'fr',
            auteurId: req.user!.userId,
            isPublished: false, // Doit être approuvé
        },
        include: { auteur: { select: { pseudo: true } } },
    });

    res.status(201).json({
        success: true,
        message: 'Podcast uploadé, en attente de validation.',
        data: podcast,
    });
});

// PATCH /podcasts/:id/publish (Admin)
router.patch('/:id/publish', authenticate, authorize('ADMIN'), async (req, res) => {
    const podcastId = qs(req.params.id);
    const podcast = await prisma.podcast.update({
        where: { id: podcastId },
        data: { isPublished: true },
    });
    res.json({ success: true, message: 'Podcast publié', data: podcast });
});

// DELETE /podcasts/:id
router.delete('/:id', authenticate, async (req, res) => {
    const podcastId = qs(req.params.id);
    const podcast = await prisma.podcast.findUnique({ where: { id: podcastId } });
    if (!podcast) throw new NotFoundError('Podcast');

    const isOwner = podcast.auteurId === req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
        res.status(403).json({ success: false, message: 'Non autorisé' });
        return;
    }

    await prisma.podcast.delete({ where: { id: podcastId } });
    res.json({ success: true, message: 'Podcast supprimé' });
});

export default router;
