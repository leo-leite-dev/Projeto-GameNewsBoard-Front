import { Status } from "../enums/status-game.enum";
import { GameResponse } from "./game-reponse.model";

export interface GameStatus {
    gameId: number;
    gameResponse: GameResponse
    status: Status
}