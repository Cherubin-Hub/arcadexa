import { Request, Response } from 'express';
import { UserModel } from '../models/user_model';
import { PasswordHelper } from '../utils/password_helper';
import { JwtHelper } from '../utils/jwt_helper';

export class AuthController {
    
    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;
            
            // 1. Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'A user with this email already exists.' });
                return;
            }

            // 2. Hash the password and save to DB
            const passwordHash = await PasswordHelper.hashPassword(password);
            await UserModel.createUser(username, email, passwordHash);

            res.status(201).json({ message: 'User registered successfully!' });
        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

        public static async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            // 1. Find the user by username
            const user = await UserModel.findByUsername(username);
            if (!user) {
                res.status(401).json({ message: 'Invalid username or password.' });
                return;
            }

            // 2. Verify the password
            const isValidPassword = await PasswordHelper.verifyPassword(password, user.PasswordHash);
            if (!isValidPassword) {
                res.status(401).json({ message: 'Invalid username or password.' });
                return;
            }

            // 3. Generate JWT Token
            const token = JwtHelper.generateToken({
                id: user.Id,
                username: user.Username,
                email: user.Email,
                firstName: user.FirstName,
            });

            // 4. Set HttpOnly Cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            res.status(200).json({ message: 'Login successful', username: user.Username, firstName: user.FirstName });
        }
         catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

        
    }

    public static async logout(req: Request, res: Response): Promise<void> {
        // Clear the HttpOnly cookie by setting its maxAge to 0
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0) // Expire immediately
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
}
