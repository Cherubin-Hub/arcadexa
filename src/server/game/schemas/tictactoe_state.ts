import { Schema, type, ArraySchema } from '@colyseus/schema';

export class TicTacToeState extends Schema {
    @type(["string"])
    board: ArraySchema<string> = new ArraySchema<string>(
        "", "", "",
        "", "", "",
        "", "", ""
    );

    @type("string")
    current_turn: string = "";

    @type("string")
    player_x: string = "";

    @type("string")
    player_o: string = "";

    @type("string")
    winner: string = "";

    @type("string")
    status: string = "waiting";
}
