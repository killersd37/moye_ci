import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Routes publiques
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Routes protégées
router.get('/me', authenticate, authController.getMe.bind(authController));
router.patch('/me', authenticate, authController.updateProfile.bind(authController));

export default router;
