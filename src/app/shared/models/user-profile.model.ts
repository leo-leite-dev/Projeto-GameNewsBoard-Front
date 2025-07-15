import { TierListResponse } from './tier-list.model';

export interface UserProfileResponse {
  userId: string;
  username: string;
  tiers: TierListResponse[];
}
