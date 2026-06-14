'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_FOOD = [15, 15];
const INITIAL_DIRECTION = [0, -1]; // UP
const SPEED = 150;

export default function SnakeGame() {
    const gameRef = useRef<HTMLDivElement>(null);
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
        setDirection(INITIAL_DIRECTION);
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
        // Focus the game container so keyboard events are captured immediately
        setTimeout(() => gameRef.current?.focus(), 0);
    };

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        // Prevent default scrolling for game keys when the game container is focused
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }

        if (!isPlaying) {
            if (e.key === ' ' || e.key === 'Enter') resetGame();
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                if (direction[1] !== 1) setDirection([0, -1]);
                break;
            case 'ArrowDown':
            case 's':
                if (direction[1] !== -1) setDirection([0, 1]);
                break;
            case 'ArrowLeft':
            case 'a':
                if (direction[0] !== 1) setDirection([-1, 0]);
                break;
            case 'ArrowRight':
            case 'd':
                if (direction[0] !== -1) setDirection([1, 0]);
                break;
        }
    }, [direction, isPlaying]);

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const moveSnake = setInterval(() => {
            setSnake(prev => {
                const head = prev[0];
                const newHead = [head[0] + direction[0], head[1] + direction[1]];

                // Hit wall
                if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return prev;
                }

                // Hit self
                for (let segment of prev) {
                    if (newHead[0] === segment[0] && newHead[1] === segment[1]) {
                        setGameOver(true);
                        setIsPlaying(false);
                        return prev;
                    }
                }

                const newSnake = [newHead, ...prev];

                // Eat food
                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setScore(s => {
                        const newScore = s + 10;
                        if (newScore > highScore) setHighScore(newScore);
                        return newScore;
                    });
                    
                    let newFood;
                    while (true) {
                        newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
                        let onSnake = false;
                        for (let segment of newSnake) {
                            if (newFood[0] === segment[0] && newFood[1] === segment[1]) {
                                onSnake = true;
                                break;
                            }
                        }
                        if (!onSnake) break;
                    }
                    setFood(newFood);
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, SPEED);

        return () => clearInterval(moveSnake);
    }, [direction, isPlaying, gameOver, food, highScore]);

    return (
        <div 
            ref={gameRef}
            className="flex flex-col items-center outline-none focus:ring-4 focus:ring-indigo-500/50 rounded-xl p-2 md:p-4 transition-shadow w-full max-w-[400px] mx-auto" 
            tabIndex={0} 
            onKeyDown={handleKeyDown}
        >
            <div className="flex justify-between w-full mb-4 text-slate-300 font-mono text-base md:text-lg px-2">
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
            
            <div className="relative bg-slate-900 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl w-full aspect-square touch-none">
                 
                {/* Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`, backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`, opacity: 0.5 }} />

                {/* Snake */}
                {snake.map((segment, i) => (
                    <div 
                        key={i}
                        className={`absolute ${i === 0 ? 'bg-indigo-500 rounded-sm z-20' : 'bg-indigo-400 rounded-sm scale-90 z-10'}`}
                        style={{ 
                            left: `${(segment[0] / GRID_SIZE) * 100}%`, 
                            top: `${(segment[1] / GRID_SIZE) * 100}%`,
                            width: `${100 / GRID_SIZE}%`,
                            height: `${100 / GRID_SIZE}%`
                        }}
                    />
                ))}

                {/* Food (Coffee) */}
                <div 
                    className="absolute bg-amber-500 rounded-full scale-75 animate-pulse flex items-center justify-center z-10"
                    style={{ 
                        left: `${(food[0] / GRID_SIZE) * 100}%`, 
                        top: `${(food[1] / GRID_SIZE) * 100}%`,
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                        fontSize: 'max(10px, 2vw)'
                    }}
                >
                    ☕
                </div>

                {/* Overlays */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-30">
                        <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg">
                            Start Game
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 bg-rose-950/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
                        <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                        <p className="text-rose-200 mb-6">Final Score: {score}</p>
                        <button onClick={resetGame} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg">
                            Play Again
                        </button>
                    </div>
                )}
            </div>
            
            {/* Mobile On-Screen Controls */}
            {isPlaying && (
                <div className="grid grid-cols-3 gap-2 mt-6 md:hidden w-full max-w-[200px]">
                    <div />
                    <button onClick={() => direction[1] !== 1 && setDirection([0, -1])} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-xl flex justify-center items-center shadow-lg text-xl select-none">▲</button>
                    <div />
                    <button onClick={() => direction[0] !== 1 && setDirection([-1, 0])} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-xl flex justify-center items-center shadow-lg text-xl select-none">◀</button>
                    <button onClick={() => direction[1] !== -1 && setDirection([0, 1])} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-xl flex justify-center items-center shadow-lg text-xl select-none">▼</button>
                    <button onClick={() => direction[0] !== -1 && setDirection([1, 0])} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-xl flex justify-center items-center shadow-lg text-xl select-none">▶</button>
                </div>
            )}
            
            <p className="text-slate-500 text-sm mt-6 text-center hidden md:block">Use Arrow Keys or WASD to move.</p>
        </div>
    );
}
