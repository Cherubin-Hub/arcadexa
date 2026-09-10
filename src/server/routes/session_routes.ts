// src/server/routes/session_routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/session_controller';
import { AuthMiddleware } from '../middlewares/session_middleware';

const router = Router();

// Public Routes (Anyone can access these)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected Route (Requires a valid HttpOnly cookie to access)
router.get('/me', AuthMiddleware, (req, res) => {
    // If they make it past AuthMiddleware, req.user will have their data
    res.status(200).json({ 
        message: 'You have access to protected data!', 
        user: (req as any).user 
    });
});

export default router;
