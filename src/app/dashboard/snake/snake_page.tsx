"use client";

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboard_layout';

const GRID_WIDTH = 50;  
const GRID_HEIGHT = 28; 
const CELL_SIZE = 24;   

const INITIAL_SNAKE = [
    { x: 15, y: 15 }, 
    { x: 15, y: 16 }, 
    { x: 15, y: 17 }, 
    { x: 15, y: 18 }  
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; 

export default function SnakePage() {
    const [hasStarted, setHasStarted] = useState(false); // NEW: Tracks if the initial game has started
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // React refs to prevent stale closures inside our setInterval game loop
    const hasStartedRef = useRef(hasStarted);
    const directionRef = useRef(direction);
    const snakeRef = useRef(snake);
    const gameOverRef = useRef(gameOver);
    const isPausedRef = useRef(isPaused);

    useEffect(() => { hasStartedRef.current = hasStarted; }, [hasStarted]);
    useEffect(() => { directionRef.current = direction; }, [direction]);
    useEffect(() => { snakeRef.current = snake; }, [snake]);
    useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const generateFood = () => ({
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
    });

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(generateFood());
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
        setHasStarted(true); // Automatically start immediately when clicking "Play Again"
    };

    // Keyboard Controls Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling when using arrows or space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // If game hasn't started, Spacebar acts as the Start Button
            if (!hasStartedRef.current) {
                if (e.key === ' ' || e.key === 'Enter') setHasStarted(true);
                return;
            }

            const dir = directionRef.current;
            if (['ArrowUp', 'w', 'W'].includes(e.key) && dir.y === 0) setDirection({ x: 0, y: -1 });
            if (['ArrowDown', 's', 'S'].includes(e.key) && dir.y === 0) setDirection({ x: 0, y: 1 });
            if (['ArrowLeft', 'a', 'A'].includes(e.key) && dir.x === 0) setDirection({ x: -1, y: 0 });
            if (['ArrowRight', 'd', 'D'].includes(e.key) && dir.x === 0) setDirection({ x: 1, y: 0 });
            
            if (e.key === ' ' && !gameOverRef.current) setIsPaused(p => !p); 
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Main Game Loop
    useEffect(() => {
        const moveSnake = () => {
            // Do not move the snake if we haven't clicked Start, or if paused/gameover
            if (!hasStartedRef.current || gameOverRef.current || isPausedRef.current) return;

            const currentSnake = [...snakeRef.current];
            const head = { ...currentSnake[0] };
            const dir = directionRef.current;

            head.x += dir.x;
            head.y += dir.y;

            // 1. Check Wall Collision
            if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
                setGameOver(true);
                return;
            }

            // 2. Check Self Collision
            if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                setGameOver(true);
                return;
            }

            // Move forward
            currentSnake.unshift(head);

            // 3. Check Food Collision
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                setFood(generateFood()); 
            } else {
                currentSnake.pop(); 
            }

            setSnake(currentSnake);
        };

        const intervalId = setInterval(moveSnake, 130); 
        return () => clearInterval(intervalId);
    }, [food]); 

    // Score Submission to Database!
    useEffect(() => {
        if (gameOver && score > 0) {
            fetch('/api/scores/snake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score })
            }).catch(err => console.error("Score submit failed:", err));
        }
    }, [gameOver, score]);

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-6">
                {/* <h1 className="text-3xl font-bold mb-4 text-gray-800">🐍 Snake</h1> */}
                
                {/* Header Container */}
                <div className="flex items-center justify-between w-full mb-5 px-2" style={{ maxWidth: GRID_WIDTH * CELL_SIZE }}>
                    
                    {/* Emphasized Score */}
                    <div className="text-2xl font-black text-gray-800 tracking-tight">
                        Score: <span className="text-green-600">{score}</span>
                    </div>
                    
                    {/* Modern Keyboard Guide */}
                    <div className="flex items-center text-gray-500">
                        <div className="flex items-center mr-5">
                            <kbd className="px-2 py-1 bg-gray-50 border border-gray-300 border-b-[3px] rounded text-[11px] font-black text-gray-700 mx-[2px] shadow-sm font-sans">W</kbd>
                            <kbd className="px-2 py-1 bg-gray-50 border border-gray-300 border-b-[3px] rounded text-[11px] font-black text-gray-700 mx-[2px] shadow-sm font-sans">A</kbd>
                            <kbd className="px-2 py-1 bg-gray-50 border border-gray-300 border-b-[3px] rounded text-[11px] font-black text-gray-700 mx-[2px] shadow-sm font-sans">S</kbd>
                            <kbd className="px-2 py-1 bg-gray-50 border border-gray-300 border-b-[3px] rounded text-[11px] font-black text-gray-700 mx-[2px] shadow-sm font-sans">D</kbd>
                            <span className="ml-2 text-sm font-bold uppercase tracking-wider">Move</span>
                        </div>
                        <div className="flex items-center">
                            <kbd className="px-4 py-1 bg-gray-50 border border-gray-300 border-b-[3px] rounded text-[11px] font-black text-gray-700 mx-[2px] shadow-sm font-sans uppercase">Space</kbd>
                            <span className="ml-2 text-sm font-bold uppercase tracking-wider">Pause</span>
                        </div>
                    </div>
                </div>

                {/* Game Board container */}
                <div 
                    className="bg-gray-800 border-4 border-gray-900 rounded-lg relative overflow-hidden shadow-xl"
                    style={{ 
                        width: GRID_WIDTH * CELL_SIZE, 
                        height: GRID_HEIGHT * CELL_SIZE,
                        // This adds a dark tint over your image so the green snake is still easy to see!
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/snake-bg.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Food */}
                    <div 
                        className="absolute flex items-center justify-center drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        style={{ width: CELL_SIZE, height: CELL_SIZE, left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }}
                    >
                        <span className="text-[18px] leading-none relative -top-[2px]">🍎</span>
                    </div>

                    {/* Snake */}
                    {snake.map((segment, index) => {
                        const isHead = index === 0;
                        return (
                            <div 
                                key={index}
                                className={`absolute rounded-full flex items-center justify-center shadow-sm transition-all duration-75 ${
                                    isHead ? 'bg-green-400 z-10 scale-110' : 'bg-green-600 z-0 scale-90'
                                }`}
                                style={{ width: CELL_SIZE, height: CELL_SIZE, left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }}
                            >
                                {isHead && <span className="text-[12px] leading-none drop-shadow-md pb-1">👀</span>}
                            </div>
                        );
                    })}

                    {/* OVERLAYS: Start / Game Over / Pause */}
                    {(!hasStarted || gameOver || isPaused) && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                            <h2 className="text-white text-4xl font-bold mb-6">
                                {!hasStarted ? 'Ready to Play?' : gameOver ? 'Game Over!' : 'Paused'}
                            </h2>
                            
                            {!hasStarted ? (
                                <button 
                                    onClick={() => setHasStarted(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
                                >
                                    Start Game
                                </button>
                            ) : gameOver ? (
                                <button 
                                    onClick={resetGame}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
                                >
                                    Play Again
                                </button>
                            ) : (
                                <p className="text-gray-300 font-bold tracking-widest uppercase animate-pulse">Press Space to Resume</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
