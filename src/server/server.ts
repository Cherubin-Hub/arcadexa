// src/server/server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import next from 'next';
import authRoutes from './routes/session_routes'; // Uses your lowercase naming!

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
// Initialize Next.js app
const nextApp = next({ dev }); 
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Wait for Next.js to prepare, then start Express
nextApp.prepare().then(() => {
    const server = express();

    // --- Global Middlewares ---
    server.use(express.json()); 
    server.use(cookieParser()); 

    // --- Express Backend Routes ---
    // Handle our API routes FIRST
    server.use('/api/auth', authRoutes);

    // --- Next.js Frontend Catch-All ---
    // If a request isn't an API route, let Next.js render the page!
    // --- Next.js Frontend Catch-All ---
    server.use((req, res) => {
        return handle(req, res);
    });

    // --- Start the Unified Server ---
    server.listen(PORT, () => {
        console.log(`> Unified Monolithic Server running on http://localhost:${PORT}`);
    });
}).catch((ex) => {
    console.error('Error starting server:', ex.stack);
    process.exit(1);
});