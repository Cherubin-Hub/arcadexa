import { Router } from 'express';
import { ScoreController } from '../controllers/score_controller';
import { AuthMiddleware } from '../middlewares/session_middleware';

const router = Router();
router.post('/snake', AuthMiddleware, ScoreController.submitSnakeScore);
router.get('/snake/leaderboard', AuthMiddleware, ScoreController.getSnakeLeaderboard);

export default router;
