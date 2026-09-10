// src/server/middlewares/session_middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../utils/jwt_helper';

export function AuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    // We use cookie-parser to automatically extract the cookie
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: 'Access Denied: Authentication token missing.' });
        return;
    }

    // Verify the JWT token
    const decoded = JwtHelper.verifyToken(token);
    if (!decoded) {
        res.status(403).json({ message: 'Access Denied: Invalid or expired token.' });
        return;
    }

    // Attach the decoded user data to the request so the next functions can use it
    (req as any).user = decoded;
    
    // Pass control to the next function
    next();
}