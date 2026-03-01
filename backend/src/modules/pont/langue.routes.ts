import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';
import { qs, qn } from '../../utils/helpers';

const router = Router();

// GET /langues
router.get('/', async (_req, res) => {
    const langues = await prisma.langue.findMany({
        where: { isActive: true },
        include: { _count: { select: { mots: true } } },
        orderBy: { nom: 'asc' },
    });
    res.json({ success: true, data: langues });
});

// GET /langues/:code
router.get('/:code', async (req, res) => {
    const langue = await prisma.langue.findUnique({
        where: { code: qs(req.params.code) },
        include: { mots: { take: 50, orderBy: { mot: 'asc' } } },
    });
    if (!langue) throw new NotFoundError('Langue');
    res.json({ success: true, data: langue });
});

// GET /langues/:code/mots?categorie=salutation&search=
router.get('/:code/mots', async (req, res) => {
    const code = qs(req.params.code);
    const categorie = qs(req.query.categorie);
    const search = qs(req.query.search);
    const page = qn(req.query.page, 1)!;
    const limit = qn(req.query.limit, 30)!;
    const skip = (page - 1) * limit;

    const langue = await prisma.langue.findUnique({ where: { code } });
    if (!langue) throw new NotFoundError('Langue');

    const where: any = { langueId: langue.id };
    if (categorie) where.categorie = categorie;
    if (search) where.mot = { contains: search, mode: 'insensitive' };

    const [total, mots] = await Promise.all([
        prisma.mot.count({ where }),
        prisma.mot.findMany({ where, skip, take: limit, orderBy: { mot: 'asc' } }),
    ]);

    res.json({
        success: true,
        data: mots,
        meta: { total, page, limit },
    });
});

// POST /langues (Admin)
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
    const langue = await prisma.langue.create({ data: req.body });
    res.status(201).json({ success: true, data: langue });
});

// POST /langues/:code/mots (Expert)
router.post('/:code/mots', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), async (req, res) => {
    const langue = await prisma.langue.findUnique({ where: { code: qs(req.params.code) } });
    if (!langue) throw new NotFoundError('Langue');

    const mot = await prisma.mot.create({ data: { ...req.body, langueId: langue.id } });
    res.status(201).json({ success: true, data: mot });
});

export default router;
