import { GameBase } from "./base/game-base.model";

export interface GameResponse extends GameBase {
  rating: number;
}