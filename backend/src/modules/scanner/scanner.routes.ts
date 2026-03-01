import { Router } from 'express';
import { uploadMemory } from '../../middlewares/upload';
import { prisma } from '../../utils/prisma';
import { optionalAuthenticate } from '../../middlewares/authenticate';

const router = Router();

// POST /scanner/analyser-image - Scanner et reconnaître un objet culturel
router.post('/analyser-image', optionalAuthenticate, uploadMemory.single('image'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'Image requise' });
        return;
    }

    // ================================================================
    // SIMULATION LOCALE (MOCK)
    // En production: remplacer par Google Vision API, OpenAI GPT-4V, etc.
    // ================================================================

    const fileSize = req.file.size;
    const fileName = req.file.originalname.toLowerCase();

    // Simulation basée sur des mots-clés dans le nom de fichier ou taille
    let mockTags: string[] = [];

    if (fileName.includes('masque') || fileName.includes('mask')) {
        mockTags = ['masque', 'bois', 'cérémonie'];
    } else if (fileName.includes('pagne') || fileName.includes('kente')) {
        mockTags = ['tissu', 'pagne', 'wax', 'tradition'];
    } else if (fileName.includes('statuette') || fileName.includes('statue')) {
        mockTags = ['statuette', 'ancêtres', 'metal', 'bronze'];
    } else {
        // Tags aléatoires pour la simulation
        const allTags = ['masque', 'pagne', 'statuette', 'bijou', 'poterie', 'sculpture', 'bois'];
        mockTags = [allTags[Math.floor(Math.random() * allTags.length)]];
    }

    // Rechercher des objets culturels correspondants
    const objetsCulturels = await prisma.objetCulturel.findMany({
        where: {
            OR: mockTags.map(tag => ({
                tags: { has: tag },
            })),
        },
        include: {
            ethnie: {
                select: {
                    nom: true,
                    slug: true,
                    imageUrl: true,
                    region: { select: { nom: true } },
                },
            },
        },
        take: 3,
    });

    // Fallback si aucun résultat
    const results = objetsCulturels.length > 0
        ? objetsCulturels
        : await prisma.objetCulturel.findMany({
            take: 2,
            include: {
                ethnie: { select: { nom: true, slug: true, imageUrl: true } },
            },
        });

    res.json({
        success: true,
        message: 'Analyse IA complète (mode simulation locale)',
        data: {
            analysisId: `scan-${Date.now()}`,
            imageSize: fileSize,
            detectedTags: mockTags,
            confidence: 0.78,
            resultats: results,
            note: 'En production, intégration avec Google Vision API ou GPT-4 Vision pour une reconnaissance précise.',
        },
    });
});

// GET /scanner/objets-culturels?tags=masque,bois
router.get('/objets-culturels', async (req, res) => {
    const { tags, ethnieId, search } = req.query;
    const where: any = {};

    if (tags) {
        const tagsList = (tags as string).split(',');
        where.tags = { hasSome: tagsList };
    }
    if (ethnieId) where.ethnieId = ethnieId;
    if (search) {
        where.OR = [
            { nom: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const objets = await prisma.objetCulturel.findMany({
        where,
        include: {
            ethnie: { select: { nom: true, slug: true, region: { select: { nom: true } } } },
        },
        orderBy: { nom: 'asc' },
        take: 20,
    });

    res.json({ success: true, data: objets });
});

export default router;
