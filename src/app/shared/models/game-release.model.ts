import { GameBase } from "./base/game-base.model";

export interface GameReleaseResponse extends GameBase {
  category: number;
}