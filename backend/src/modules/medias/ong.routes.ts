import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';
import { qs, qn } from '../../utils/helpers';

const router = Router();

// GET /ongs?domaine=patrimoine&search=
router.get('/', async (req, res) => {
    const page = qn(req.query.page, 1)!;
    const limit = qn(req.query.limit, 20)!;
    const skip = (page - 1) * limit;
    const domaine = qs(req.query.domaine);
    const verified = qs(req.query.verified);
    const search = qs(req.query.search);

    const where: any = {};
    if (domaine) where.domaine = { contains: domaine, mode: 'insensitive' };
    if (verified === 'true') where.isVerified = true;
    if (search) where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { mission: { contains: search, mode: 'insensitive' } },
    ];

    const [total, ongs] = await Promise.all([
        prisma.oNG.count({ where }),
        prisma.oNG.findMany({
            where,
            skip,
            take: limit,
            include: {
                responsable: { select: { pseudo: true, email: true } },
                _count: { select: { artisans: true } },
            },
            orderBy: { nom: 'asc' },
        }),
    ]);

    res.json({
        success: true,
        data: ongs,
        meta: { total, page },
    });
});

// GET /ongs/:id
router.get('/:id', async (req, res) => {
    const ongId = qs(req.params.id);
    const ong = await prisma.oNG.findUnique({
        where: { id: ongId },
        include: {
            responsable: { select: { pseudo: true, email: true } },
            artisans: { orderBy: { nom: 'asc' } },
        },
    });
    if (!ong) throw new NotFoundError('ONG');
    res.json({ success: true, data: ong });
});

// POST /ongs - Créer une ONG (authentifié)
router.post('/', authenticate, async (req, res) => {
    const { nom, description, mission, logoUrl, siteWeb, email, telephone, localisation, domaine } = req.body as {
        nom: string;
        description: string;
        mission: string;
        logoUrl?: string;
        siteWeb?: string;
        email?: string;
        telephone?: string;
        localisation?: string;
        domaine?: string;
    };
    const ong = await prisma.oNG.create({
        data: {
            nom,
            description,
            mission,
            logoUrl,
            siteWeb,
            email,
            telephone,
            localisation,
            domaine,
            responsableId: req.user!.userId,
            isVerified: false,
        },
    });
    res.status(201).json({ success: true, data: ong });
});

// PUT /ongs/:id
router.put('/:id', authenticate, async (req, res) => {
    const ongId = qs(req.params.id);
    const ong = await prisma.oNG.findUnique({ where: { id: ongId } });
    if (!ong) throw new NotFoundError('ONG');

    const isOwner = ong.responsableId === req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
        res.status(403).json({ success: false, message: 'Non autorisé' });
        return;
    }

    const { nom, description, mission, logoUrl, siteWeb, email, telephone, localisation, domaine } = req.body as {
        nom?: string;
        description?: string;
        mission?: string;
        logoUrl?: string;
        siteWeb?: string;
        email?: string;
        telephone?: string;
        localisation?: string;
        domaine?: string;
    };

    const updated = await prisma.oNG.update({
        where: { id: ongId },
        data: { nom, description, mission, logoUrl, siteWeb, email, telephone, localisation, domaine },
    });
    res.json({ success: true, data: updated });
});

// PATCH /ongs/:id/verify (Admin)
router.patch('/:id/verify', authenticate, authorize('ADMIN'), async (req, res) => {
    const ong = await prisma.oNG.update({
        where: { id: qs(req.params.id) },
        data: { isVerified: true },
    });
    res.json({ success: true, message: 'ONG vérifiée', data: ong });
});

// DELETE /ongs/:id (Admin)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    await prisma.oNG.delete({ where: { id: qs(req.params.id) } });
    res.json({ success: true, message: 'ONG supprimée' });
});

// POST /ongs/:id/artisans
router.post('/:id/artisans', authenticate, async (req, res) => {
    const ongId = qs(req.params.id);
    const ong = await prisma.oNG.findUnique({ where: { id: ongId } });
    if (!ong) throw new NotFoundError('ONG');

    const { nom, prenom, specialite, description, photoUrl, localisation, contact } = req.body as {
        nom: string;
        prenom?: string;
        specialite: string;
        description?: string;
        photoUrl?: string;
        localisation?: string;
        contact?: string;
    };
    const artisan = await prisma.artisan.create({
        data: { nom, prenom, specialite, description, photoUrl, localisation, contact, ongId },
    });
    res.status(201).json({ success: true, data: artisan });
});

// GET /ongs/artisans/tous
router.get('/artisans/tous', async (req, res) => {
    const specialite = qs(req.query.specialite);
    const search = qs(req.query.search);
    const where: any = {};
    if (specialite) where.specialite = { contains: specialite, mode: 'insensitive' };
    if (search) where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { specialite: { contains: search, mode: 'insensitive' } },
    ];

    const artisans = await prisma.artisan.findMany({
        where,
        include: { ong: { select: { nom: true, isVerified: true } } },
        orderBy: { nom: 'asc' },
    });
    res.json({ success: true, data: artisans });
});

export default router;
