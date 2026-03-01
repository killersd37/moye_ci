import { Router } from 'express';
import { ethnieController } from './ethnie.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Routes publiques
router.get('/', ethnieController.findAll.bind(ethnieController));
router.get('/regions', ethnieController.getRegions.bind(ethnieController));
router.get('/:slug', ethnieController.findBySlug.bind(ethnieController));

// Routes admin/expert
router.post('/', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.create.bind(ethnieController));
router.put('/:id', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.update.bind(ethnieController));
router.delete('/:id', authenticate, authorize('ADMIN'), ethnieController.delete.bind(ethnieController));

// Sous-ressources
router.post('/:id/histoires', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.createHistoire.bind(ethnieController));
router.post('/:id/rites', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.createRite.bind(ethnieController));
router.post('/:id/gastronomies', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.createGastronomie.bind(ethnieController));
router.post('/:id/fetes', authenticate, authorize('ADMIN', 'EXPERT_CULTUREL'), ethnieController.createFete.bind(ethnieController));

export default router;
