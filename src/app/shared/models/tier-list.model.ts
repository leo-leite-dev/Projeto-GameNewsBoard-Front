import { TierListEntry } from './tier-list-entry.model';

export interface TierListResponse {
  id: string;
  title: string;
  imageUrl?: string | null;
  imageId?: string | null;
  entries: TierListEntry[];
}

export interface TierListRequest {
  title: string;
  imageUrl?: string | null;
  imageId?: string | null;
}
