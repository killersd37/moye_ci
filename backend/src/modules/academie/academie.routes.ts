import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authenticate';
import { prisma } from '../../utils/prisma';
import { NotFoundError, AppError } from '../../middlewares/errorHandler';
import { z } from 'zod';
import { qs, qn } from '../../utils/helpers';

const router = Router();

const quizSubmitSchema = z.object({
    leconId: z.string().min(1),
    reponses: z.array(z.object({
        questionId: z.string(),
        reponseId: z.string(),
    })),
});

// GET /academie/niveaux
router.get('/niveaux', async (_req, res) => {
    const niveaux = await prisma.niveau.findMany({
        include: {
            _count: { select: { lecons: true } },
        },
        orderBy: { ordre: 'asc' },
    });
    res.json({ success: true, data: niveaux });
});

// GET /academie/niveaux/:id/lecons
router.get('/niveaux/:id/lecons', async (req, res) => {
    const lecons = await prisma.lecon.findMany({
        where: { niveauId: qs(req.params.id), isActive: true },
        include: { _count: { select: { questions: true } } },
        orderBy: { ordre: 'asc' },
    });
    res.json({ success: true, data: lecons });
});

// GET /academie/lecons/:id
router.get('/lecons/:id', async (req, res) => {
    const lecon = await prisma.lecon.findUnique({
        where: { id: qs(req.params.id) },
        include: {
            niveau: true,
            questions: {
                include: { reponses: true },
                orderBy: { createdAt: 'asc' },
            },
        },
    });
    if (!lecon) throw new NotFoundError('Leçon');
    res.json({ success: true, data: lecon });
});

// POST /academie/quiz/soumettre - Soumettre un quiz
router.post('/quiz/soumettre', authenticate, async (req, res) => {
    const { leconId, reponses } = quizSubmitSchema.parse(req.body);
    const userId = req.user!.userId;

    const lecon = await prisma.lecon.findUnique({
        where: { id: leconId },
        include: {
            questions: { include: { reponses: { where: { estCorrecte: true } } } },
        },
    });
    if (!lecon) throw new NotFoundError('Leçon');

    // Calculer le score
    let correctCount = 0;
    for (const rep of reponses) {
        const question = lecon.questions.find(q => q.id === rep.questionId);
        if (question) {
            const correctReponse = question.reponses.find(r => r.id === rep.reponseId && r.estCorrecte);
            if (correctReponse) correctCount++;
        }
    }

    const totalQuestions = lecon.questions.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const pointsGagnes = scorePercent >= 50 ? Math.round(lecon.pointsGain * (scorePercent / 100)) : 0;
    const completee = scorePercent >= 70;

    // Sauvegarder la progression
    const progression = await prisma.progressionUtilisateur.create({
        data: {
            userId,
            niveauId: lecon.niveauId,
            leconId,
            pointsGagnes,
            completee,
            scoreQuiz: scorePercent,
        },
    });

    // Attribuer les points Moyé-Or si quiz réussi
    if (pointsGagnes > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: { moyeOrPoints: { increment: pointsGagnes } },
        });
    }

    // Vérifier et attribuer les badges
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { moyeOrPoints: true },
    });

    const badgesGagnes = [];
    if (user && user.moyeOrPoints >= 100) {
        const badge = await prisma.badge.findUnique({ where: { nom: 'Apprenti Culturel' } });
        if (badge) {
            try {
                await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
                badgesGagnes.push(badge);
            } catch {
                // Badge déjà obtenu (contrainte unique)
            }
        }
    }

    res.json({
        success: true,
        message: completee ? '🎉 Félicitations ! Leçon complétée !' : 'Quiz soumis. Recommencez pour améliorer votre score !',
        data: {
            score: scorePercent,
            correctCount,
            totalQuestions,
            pointsGagnes,
            completee,
            badgesGagnes,
            progression,
        },
    });
});

// GET /academie/ma-progression (Utilisateur connecté)
router.get('/ma-progression', authenticate, async (req, res) => {
    const userId = req.user!.userId;

    const [progressions, user] = await Promise.all([
        prisma.progressionUtilisateur.findMany({
            where: { userId },
            include: {
                niveau: { select: { nom: true, type: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { moyeOrPoints: true, streakDays: true, badges: { include: { badge: true } } },
        }),
    ]);

    const niveauActuel = progressions.length > 0
        ? (user?.moyeOrPoints || 0) >= 500 ? 'BAOBAB'
            : (user?.moyeOrPoints || 0) >= 100 ? 'PALMIER'
                : 'GRAIN_DE_SABLE'
        : 'GRAIN_DE_SABLE';

    res.json({
        success: true,
        data: {
            user,
            progressions,
            niveauActuel,
            totalLecons: progressions.filter(p => p.completee).length,
        },
    });
});

// POST /academie/lecons (Admin)
router.post('/lecons', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), async (req, res) => {
    const lecon = await prisma.lecon.create({ data: req.body });
    res.status(201).json({ success: true, data: lecon });
});

// POST /academie/lecons/:id/questions (Admin)
router.post('/lecons/:id/questions', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), async (req, res) => {
    const enonce = req.body.enonce as string;
    const type = (req.body.type as string) || 'choix_multiple';
    const imageUrl = (req.body.imageUrl as string | undefined) ?? null;
    const explication = (req.body.explication as string | undefined) ?? null;
    const reponsesData: Array<{ contenu: string; estCorrecte?: boolean; explication?: string }> =
        Array.isArray(req.body.reponses) ? req.body.reponses : [];

    const question = await prisma.question.create({
        data: {
            enonce,
            type,
            imageUrl,
            explication,
            leconId: qs(req.params.id),
            reponses: {
                create: reponsesData,
            },
        },
        include: { reponses: true },
    });
    res.status(201).json({ success: true, data: question });
});

export default router;
