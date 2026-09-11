import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import next from 'next';
import { createServer } from 'http';
import { Server as ColyseusServer } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import authRoutes from './routes/session_routes';
import { TicTacToeRoom } from './game/rooms/tictactoe_room';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = Number(process.env.PORT) || 3000;

nextApp.prepare().then(() => {
    const app = express();

    // --- Global Middlewares ---
    app.use(express.json());
    app.use(cookieParser());

    // --- Express Backend Routes ---
    app.use('/api/auth', authRoutes);

    // --- Next.js Frontend Catch-All ---
    app.use((req, res) => {
        return handle(req, res);
    });

    // --- Create a single HTTP server for everything ---
    const httpServer = createServer(app);

    // --- Attach Colyseus to the same HTTP server ---
    const gameServer = new ColyseusServer();
    gameServer.listen(2567);

    // --- Register Game Rooms ---
    gameServer.define("tictactoe", TicTacToeRoom);

    // --- Start the Unified Server ---
    httpServer.listen(PORT, () => {
        console.log(`> Unified Monolithic Server running on http://localhost:${PORT}`);
        console.log(`> Colyseus WebSocket server attached (ws://localhost:${PORT})`);
    });
}).catch((ex) => {
    console.error('Error starting server:', ex.stack);
    process.exit(1);
});
