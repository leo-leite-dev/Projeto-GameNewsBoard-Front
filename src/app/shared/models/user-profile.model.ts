import { GameStatusResponse } from './game-status.model';
import { TierListResponse } from './tier-list.model';

export interface UserProfileResponse {
  userId: string;
  username: string;
  tiers: TierListResponse[];
  status?: GameStatusResponse | null;
}