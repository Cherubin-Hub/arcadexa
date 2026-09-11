import sql from 'mssql';
import { dbPoolPromise } from '../utils/database';

export class ScoreModel {
    public static async saveSnakeScore(userId: number, score: number): Promise<void> {
        const pool = await dbPoolPromise;
        await pool.request()
            .input('UserId', sql.Int, userId)
            .input('Score', sql.Int, score)
            .query(`INSERT INTO tblSnakeScores (UserId, Score) VALUES (@UserId, @Score)`);
    }

    public static async getSnakeLeaderboard(): Promise<any[]> {
        const pool = await dbPoolPromise;
        const result = await pool.request().query(`
            SELECT TOP 10
                u.FirstName,
                MAX(s.Score) as HighestScore
            FROM tblSnakeScores s
            JOIN tblUsers u ON s.UserId = u.Id
            GROUP BY u.Id, u.FirstName
            ORDER BY HighestScore DESC
        `);
        return result.recordset;
    }
}
