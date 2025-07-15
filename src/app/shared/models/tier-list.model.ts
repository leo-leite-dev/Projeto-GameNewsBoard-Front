import { extend } from 'lodash';
import { TierListEntry } from './tier-list-entry.model';

export interface TierList {
  title: string;
  imageUrl?: string | null;
  imageId?: string | null;
}

export interface TierListResponse extends TierList {
  id: string;
  entries: TierListEntry[];
}

export interface TierListRequest extends TierList {}

export interface UpdateTierListRequest extends TierList {}
