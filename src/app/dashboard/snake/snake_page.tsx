// src/app/dashboard/snake/snake_page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboard_layout';

const GRID_WIDTH = 40;  
const GRID_HEIGHT = 25; 
const CELL_SIZE = 24;   

const INITIAL_SNAKE = [
    { x: 15, y: 15 }, 
    { x: 15, y: 16 }, 
    { x: 15, y: 17 }, 
    { x: 15, y: 18 }  
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; 

export default function SnakePage() {
    const [hasStarted, setHasStarted] = useState(false); 
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
        setHasStarted(true); 
    };

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

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

    // Score Submission to Database
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
            {/* Main Row Wrapper */}
            <div className="flex flex-row justify-center items-start gap-20 py-15 w-full">
                
                {/* ----------------- GAME COLUMN ----------------- */}
                <div className="flex flex-col items-center justify-center">
                    {/* <h1 className="text-3xl font-bold mb-4 text-gray-800">🐍 Snake</h1> */}
                    
                    {/* Header Container (Score & Keys) */}
                    <div className="flex items-center justify-between w-full mb-5 px-2" style={{ maxWidth: GRID_WIDTH * CELL_SIZE }}>
                        <div className="text-2xl font-bold text-white tracking-tight">
                            Score: <span className="text-green-600">{score}</span>
                        </div>
                        
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
                        style={{ width: GRID_WIDTH * CELL_SIZE, height: GRID_HEIGHT * CELL_SIZE }}
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
                            
                            let rotation = '0deg';
                            if (isHead) {
                                if (direction.y === -1) rotation = '0deg';    
                                if (direction.y === 1)  rotation = '180deg';  
                                if (direction.x === 1)  rotation = '90deg';   
                                if (direction.x === -1) rotation = '-90deg';  
                            }

                            return (
                                <div 
                                    key={index}
                                    className={`absolute transition-all duration-75 shadow-sm rounded-full ${isHead ? 'bg-green-400' : 'bg-green-600'}`}
                                    style={{ 
                                        width: CELL_SIZE, 
                                        height: CELL_SIZE, 
                                        left: segment.x * CELL_SIZE, 
                                        top: segment.y * CELL_SIZE,
                                        backgroundImage: isHead ? `url('/snake-head.jpg')` : `url('/snake-body.jpg')`,
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        transform: isHead ? `rotate(${rotation}) scale(1.1)` : 'scale(0.95)',
                                        zIndex: isHead ? 10 : 0
                                    }}
                                />
                            );
                        })}

                        {/* OVERLAYS */}
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

                {/* ----------------- AVATAR COLUMN ----------------- */}
                <div className="hidden lg:flex flex-col items-center mt-32 relative">
                    <style>{`
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-15px); }
                            100% { transform: translateY(0px); }
                        }
                    `}</style>
                    
                    {/* The Avatar */}
                    <div 
                        className="w-64" 
                        style={{ animation: "float 3s ease-in-out infinite" }}
                    >
                        <img src="/snake-bg.png" alt="Snake Avatar" className="w-full h-auto object-contain drop-shadow-2xl" />
                    </div>

                    {/* Speech bubble */}
                    <div className="mt-6 bg-gray-800 text-white px-5 py-2 rounded-xl shadow-lg relative" style={{ animation: "float 3s ease-in-out infinite" }}>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
                        <p className="font-bold text-lg tracking-wide">Get that high score!</p>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
