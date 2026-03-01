import { Router } from 'express';
import { postChat, getHealth } from '../controllers/chat.controller';

const router = Router();

router.post('/', postChat);
router.get('/health', getHealth);

export default router;
