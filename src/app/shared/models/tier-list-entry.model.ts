import { TierLevel } from '../enums/tier-level.enum';
import { GameResponse } from './game-reponse.model';

export interface TierListEntry {
  gameId: number;
  game: GameResponse;
  tier: TierLevel;
}

export interface TierListEntryRequest {
  gameId: number;
  tier: number;  
}