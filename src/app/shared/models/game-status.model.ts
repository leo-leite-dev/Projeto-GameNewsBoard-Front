import { Status } from "../enums/status-game.enum";
import { GameResponse } from "./game.model";

export interface GameStatusResponse {
    gameId: number;
    gameResponse: GameResponse
    status: Status
}
export interface GameStatusRequest {
    status: Status
}