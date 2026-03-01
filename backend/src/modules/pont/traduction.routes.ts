import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError, AppError } from '../../middlewares/errorHandler';
import { z } from 'zod';
import { translateBeteToFrancais, translateFrancaisToBete } from './beteLexique';

const router = Router();

const traductionSchema = z.object({
    texteSource: z.string().min(1, 'Texte source requis'),
    langueSourceCode: z.string().min(1),
    langueCibleCode: z.string().min(1),
    contexte: z.string().optional(),
});

// POST /traductions/traduire - Traduction texte→texte
router.post('/traduire', async (req, res) => {
    const { texteSource, langueSourceCode, langueCibleCode, contexte } = traductionSchema.parse(req.body);

    // 1) Chercher dans la base de données
    const [langueSource, langueCible] = await Promise.all([
        prisma.langue.findUnique({ where: { code: langueSourceCode } }),
        prisma.langue.findUnique({ where: { code: langueCibleCode } }),
    ]);

    if (!langueSource) throw new NotFoundError(`Langue source "${langueSourceCode}"`);
    if (!langueCible) throw new NotFoundError(`Langue cible "${langueCibleCode}"`);

    // Chercher traduction existante
    const existing = await prisma.traduction.findFirst({
        where: {
            texteSource: { equals: texteSource, mode: 'insensitive' },
            langueSourceId: langueSource.id,
            langueCibleId: langueCible.id,
        },
    });

    if (existing) {
        res.json({
            success: true,
            data: {
                texteSource,
                texteTraduction: existing.texteTraduction,
                langueSource: langueSource.code,
                langueCible: langueCible.code,
                source: 'database',
                validee: existing.validee,
            },
        });
        return;
    }

    // 2) Simulation locale (mock IA + lexique Bété)
    const mockTranslations: Record<string, Record<string, string>> = {
        'bonjour': { 'baoule': 'Akwaba', 'dioula': 'I ni ce', 'bete': 'Ni gbouê', 'senoufo': 'Kpele' },
        'merci': { 'baoule': 'Mo akua', 'dioula': 'I ni baara', 'bete': 'Yé kpê' },
        'comment ça va': { 'baoule': 'É kéh?', 'dioula': 'I ka kénê?' },
        'bonne nuit': { 'baoule': 'Sun kura', 'dioula': 'Suu kalama' },
        'bienvenue': { 'baoule': 'Akwaba', 'dioula': 'Bienvenido', 'senoufo': 'Wor gbel' },
    };

    const texteLower = texteSource.toLowerCase().trim();

    // a) Cas spécifique Bété ↔ Français basé sur la base lexicale
    let texteTraduction: string | null = null;
    let sourceTag: 'lexique_bete' | 'database_mock' | 'ia_simulation' = 'ia_simulation';
    let isValidee = false;

    if (langueSourceCode === 'bete' && langueCibleCode === 'fr') {
        const fromBete = translateBeteToFrancais(texteSource);
        if (fromBete) {
            texteTraduction = fromBete;
            sourceTag = 'lexique_bete';
            isValidee = true;
        }
    } else if (langueSourceCode === 'fr' && langueCibleCode === 'bete') {
        const fromFr = translateFrancaisToBete(texteSource);
        if (fromFr) {
            texteTraduction = fromFr;
            sourceTag = 'lexique_bete';
            isValidee = true;
        }
    }

    // b) Fallback vers le mock existant ou la simulation IA
    if (!texteTraduction) {
        const mockResult = mockTranslations[texteLower]?.[langueCibleCode];
        if (mockResult) {
            texteTraduction = mockResult;
            sourceTag = 'database_mock';
            isValidee = true;
        } else {
            texteTraduction = `[Traduction IA: "${texteSource}" → ${langueCible.nom}]`;
            sourceTag = 'ia_simulation';
            isValidee = false;
        }
    }

    // Sauvegarder la traduction
    await prisma.traduction.create({
        data: {
            texteSource,
            texteTraduction,
            langueSourceId: langueSource.id,
            langueCibleId: langueCible.id,
            contexte,
            validee: isValidee,
        },
    });

    res.json({
        success: true,
        data: {
            texteSource,
            texteTraduction,
            langueSource: langueSource.code,
            langueCible: langueCible.code,
            source: sourceTag,
            validee: isValidee,
        },
    });
});

// GET /traductions?langueSource=fr&langueCible=baoule&search=bonjour
router.get('/', async (req, res) => {
    const { langueSource, langueCible, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (langueSource) {
        const l = await prisma.langue.findUnique({ where: { code: langueSource as string } });
        if (l) where.langueSourceId = l.id;
    }
    if (langueCible) {
        const l = await prisma.langue.findUnique({ where: { code: langueCible as string } });
        if (l) where.langueCibleId = l.id;
    }
    if (search) where.texteSource = { contains: search, mode: 'insensitive' };

    const [total, traductions] = await Promise.all([
        prisma.traduction.count({ where }),
        prisma.traduction.findMany({
            where,
            skip,
            take: parseInt(limit as string),
            include: {
                langueSource: { select: { code: true, nom: true } },
                langueCible: { select: { code: true, nom: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    res.json({
        success: true,
        data: traductions,
        meta: { total, page: parseInt(page as string) },
    });
});

// POST /traductions/audio (préparer endpoint pour audio)
router.post('/audio', authenticate, async (_req, res) => {
    // Endpoint préparé pour l'intégration TTS/STT future
    res.json({
        success: true,
        message: 'Endpoint audio prêt pour intégration (Whisper/Google TTS)',
        data: {
            supportedFormats: ['mp3', 'wav', 'ogg'],
            maxDurationSeconds: 60,
            status: 'coming_soon',
        },
    });
});

export default router;
