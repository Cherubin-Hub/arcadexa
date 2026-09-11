import { Room, Client } from 'colyseus';
import { TicTacToeState } from '../schemas/tictactoe_state';

export class TicTacToeRoom extends Room<{ state: TicTacToeState }> {
    maxClients = 2;

    private static readonly WIN_CONDITIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    onCreate() {
        this.setState(new TicTacToeState());
        this.onMessage("move", (client, data: { index: number }) => {
            this.handleMove(client, data.index);
        });
    }

    onJoin(client: Client) {
        if (this.state.player_x === "") {
            this.state.player_x = client.sessionId;
            console.log(`Player X joined: ${client.sessionId}`);
        }
        else if (this.state.player_o === "") {
            this.state.player_o = client.sessionId;
            this.state.current_turn = this.state.player_x; // X always goes first
            this.state.status = "playing";
            this.lock(); // No more players can join this room
            console.log(`Player O joined: ${client.sessionId} — Game started!`);
        }
    }

    onLeave(client: Client) {
        if (this.state.status === "playing") {
            this.state.winner = client.sessionId === this.state.player_x ? "O" : "X";
            this.state.status = "finished";
            console.log(`Player ${client.sessionId} disconnected. Opponent wins!`);
        }
    }

    private handleMove(client: Client, index: number) {
        if (this.state.status !== "playing") return;
        if (client.sessionId !== this.state.current_turn) return;
        if (index < 0 || index > 8 || this.state.board[index] !== "") return;

        const mark = client.sessionId === this.state.player_x ? "X" : "O";
        this.state.board[index] = mark;

        if (this.checkWin(mark)) {
            this.state.winner = mark;
            this.state.status = "finished";
            return;
        }
        if (this.checkDraw()) {
            this.state.winner = "draw";
            this.state.status = "finished";
            return;
        }
        this.state.current_turn =
            client.sessionId === this.state.player_x
                ? this.state.player_o
                : this.state.player_x;
    }

    private checkWin(mark: string): boolean {
        return TicTacToeRoom.WIN_CONDITIONS.some(([a, b, c]) =>
            this.state.board[a] === mark &&
            this.state.board[b] === mark &&
            this.state.board[c] === mark
        );
    }

    private checkDraw(): boolean {
        return this.state.board.every(cell => cell !== "");
    }
}
