import { Request, Response } from 'express';
import { ScoreModel } from '../models/score_model';

export class ScoreController {
    public static async submitSnakeScore(req: Request, res: Response): Promise<void> {
        try {
            const { score } = req.body;
            const userId = (req as any).user.id; // Pulled from the JWT AuthMiddleware

            if (score > 0) await ScoreModel.saveSnakeScore(userId, score);
            res.status(201).json({ message: 'Score saved' });
        } catch (error) {
            console.error('Score Submit Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public static async getSnakeLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const leaderboard = await ScoreModel.getSnakeLeaderboard();
            res.status(200).json({ leaderboard });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
