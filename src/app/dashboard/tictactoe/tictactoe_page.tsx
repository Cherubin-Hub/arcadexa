"use client";

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard_layout';
import * as Colyseus from '@colyseus/sdk';

export default function TicTacToePage() {
    const [room, setRoom] = useState<Colyseus.Room | null>(null);
    const [board, setBoard] = useState<string[]>(Array(9).fill(""));
    const [myMark, setMyMark] = useState<string>("");
    const [status, setStatus] = useState<string>("waiting");
    const [winner, setWinner] = useState<string>("");
    const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("Connecting...");

    const connectToGame = useCallback(async () => {
        try {
            const client = new Colyseus.Client("ws://localhost:2567");
            const joinedRoom = await client.joinOrCreate("tictactoe");

            setRoom(joinedRoom);
            setMessage("Waiting for an opponent...");

            joinedRoom.onStateChange((state: any) => {
                const newBoard: string[] = [];
                for (let i = 0; i < 9; i++) {
                    newBoard.push(state.board[i] || "");
                }
                setBoard(newBoard);

                if (state.player_x === joinedRoom.sessionId) {
                    setMyMark("X");
                } else if (state.player_o === joinedRoom.sessionId) {
                    setMyMark("O");
                }

                setIsMyTurn(state.current_turn === joinedRoom.sessionId);

                setStatus(state.status);
                setWinner(state.winner);

                if (state.status === "waiting") {
                    setMessage("Waiting for an opponent...");
                } else if (state.status === "playing") {
                    if (state.current_turn === joinedRoom.sessionId) {
                        setMessage("Your turn!");
                    } else {
                        setMessage("Opponent's turn...");
                    }
                } else if (state.status === "finished") {
                    if (state.winner === "draw") {
                        setMessage("It's a draw!");
                    } else {
                        const iWon =
                            (state.winner === "X" && state.player_x === joinedRoom.sessionId) ||
                            (state.winner === "O" && state.player_o === joinedRoom.sessionId);
                        setMessage(iWon ? "You win! 🎉" : "You lose! 😞");
                    }
                }
            });

            joinedRoom.onLeave(() => {
                setMessage("Disconnected from the game.");
                setRoom(null);
            });

        } catch (err) {
            console.error("Connection error:", err);
            setMessage("Failed to connect to the game server.");
        }
    }, []);

    useEffect(() => {
        connectToGame();
        return () => {
            room?.leave();
        };
    }, [connectToGame]);

    const handleCellClick = (index: number) => {
        if (!room || status !== "playing" || !isMyTurn || board[index] !== "") return;
        room.send("move", { index });
    };

    const handlePlayAgain = async () => {
        room?.leave();
        setBoard(Array(9).fill(""));
        setMyMark("");
        setStatus("waiting");
        setWinner("");
        setIsMyTurn(false);
        await connectToGame();
    };

    const renderCell = (index: number) => {
        const value = board[index];
        const cellColor = value === "X" ? "text-blue-600" : value === "O" ? "text-red-600" : "";
        const isClickable = status === "playing" && isMyTurn && value === "";

        return (
            <button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`w-24 h-24 border-2 border-gray-300 text-4xl font-bold flex items-center justify-center
                    ${cellColor}
                    ${isClickable ? "hover:bg-gray-100 cursor-pointer" : "cursor-not-allowed"}
                    transition-colors duration-150`}
            >
                {value}
            </button>
        );
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-2">Tic-Tac-Toe</h1>

                {/* Player Info */}
                {myMark && (
                    <p className="text-lg mb-4">
                        You are: <span className={`font-bold ${myMark === "X" ? "text-blue-600" : "text-red-600"}`}>{myMark}</span>
                    </p>
                )}

                {/* Status Message */}
                <p className={`text-lg mb-6 font-semibold ${
                    winner === "draw" ? "text-yellow-600" :
                    message.includes("win") ? "text-green-600" :
                    message.includes("lose") ? "text-red-600" :
                    "text-gray-700"
                }`}>
                    {message}
                </p>

                {/* Game Board */}
                <div className="grid grid-cols-3 gap-1 mb-6 bg-gray-400 p-1 rounded">
                    {Array.from({ length: 9 }, (_, i) => renderCell(i))}
                </div>

                {/* Play Again Button */}
                {status === "finished" && (
                    <button
                        onClick={handlePlayAgain}
                        className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
                    >
                        Play Again
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
}
