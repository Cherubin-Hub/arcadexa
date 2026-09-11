"use client";

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboard_layout';

const GRID_SIZE = 20; // 20x20 grid
const CELL_SIZE = 22; // 22px per cell
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP

export default function SnakePage() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // React refs to prevent stale closures inside our setInterval game loop
    const directionRef = useRef(direction);
    const snakeRef = useRef(snake);
    const gameOverRef = useRef(gameOver);
    const isPausedRef = useRef(isPaused);

    useEffect(() => { directionRef.current = direction; }, [direction]);
    useEffect(() => { snakeRef.current = snake; }, [snake]);
    useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const generateFood = () => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    });

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(generateFood());
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
    };

    // Keyboard Controls Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling when using arrows
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            const dir = directionRef.current;
            if (['ArrowUp', 'w', 'W'].includes(e.key) && dir.y === 0) setDirection({ x: 0, y: -1 });
            if (['ArrowDown', 's', 'S'].includes(e.key) && dir.y === 0) setDirection({ x: 0, y: 1 });
            if (['ArrowLeft', 'a', 'A'].includes(e.key) && dir.x === 0) setDirection({ x: -1, y: 0 });
            if (['ArrowRight', 'd', 'D'].includes(e.key) && dir.x === 0) setDirection({ x: 1, y: 0 });
            if (e.key === ' ') setIsPaused(p => !p); // Spacebar pauses
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Main Game Loop
    useEffect(() => {
        const moveSnake = () => {
            if (gameOverRef.current || isPausedRef.current) return;

            const currentSnake = [...snakeRef.current];
            const head = { ...currentSnake[0] };
            const dir = directionRef.current;

            head.x += dir.x;
            head.y += dir.y;

            // 1. Check Wall Collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
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
                setFood(generateFood()); // Spawn new food
            } else {
                currentSnake.pop(); // Remove tail if no food eaten
            }

            setSnake(currentSnake);
        };

        const intervalId = setInterval(moveSnake, 130); // 130ms speed
        return () => clearInterval(intervalId);
    }, [food]); // Re-bind loop when food changes

    // Score Submission to Database! (Fires automatically when game over happens)
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
                <h1 className="text-3xl font-bold mb-2 text-gray-800">🐍 Snake</h1>
                
                <div className="flex justify-between w-full max-w-md mb-4 px-2">
                    <span className="text-xl font-bold text-gray-700">Score: {score}</span>
                    <span className="text-gray-500 text-sm mt-1">WASD / Arrows to move. Space to Pause.</span>
                </div>

                {/* Game Board container */}
                <div 
                    className="bg-gray-800 border-4 border-gray-900 rounded-lg relative overflow-hidden shadow-xl"
                    style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
                >
                    {/* Food */}
                    <div 
                        className="absolute bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        style={{ 
                            width: CELL_SIZE, height: CELL_SIZE, 
                            left: food.x * CELL_SIZE, top: food.y * CELL_SIZE 
                        }}
                    />

                    {/* Snake */}
                    {snake.map((segment, index) => (
                        <div 
                            key={index}
                            className={`absolute rounded-sm border border-green-800 ${
                                index === 0 ? 'bg-green-400' : 'bg-green-600'
                            }`}
                            style={{ 
                                width: CELL_SIZE, height: CELL_SIZE, 
                                left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE 
                            }}
                        />
                    ))}

                    {/* Game Over / Pause Overlay */}
                    {(gameOver || isPaused) && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                            <h2 className="text-white text-4xl font-bold mb-6">
                                {gameOver ? 'Game Over!' : 'Paused'}
                            </h2>
                            {gameOver && (
                                <button 
                                    onClick={resetGame}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
                                >
                                    Play Again
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}