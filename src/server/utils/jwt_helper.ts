// src/server/utils/jwt_helper.ts
import jwt from 'jsonwebtoken';

export class JwtHelper {
    private static readonly SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
    private static readonly EXPIRES_IN = '1h';

    public static generateToken(payload: object): string {
        return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRES_IN });
    }

    public static verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.SECRET);
        } catch (error) {
            return null; 
        }
    }
}