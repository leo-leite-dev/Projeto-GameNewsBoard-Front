import { TierLevel } from '../enums/tier-level.enum';
import { GameResponse } from '../models/game-reponse.model';

export interface TierInfo {
    level: TierLevel;
    label: string;
    class: string;
    color: string;
}

export const TIER_CONFIG: TierInfo[] = [
    { level: TierLevel.SSS, label: 'SSS', class: 'tier-sss', color: '#ffa500' },
    { level: TierLevel.SS, label: 'SS', class: 'tier-ss', color: '#e83e8c' },
    { level: TierLevel.S, label: 'S', class: 'tier-s', color: '#6f42c1' },
    { level: TierLevel.A, label: 'A', class: 'tier-a', color: '#007bff' },
    { level: TierLevel.C, label: 'C', class: 'tier-c', color: '#28a745' },
    { level: TierLevel.D, label: 'D', class: 'tier-d', color: '#6c757d' },
    { level: TierLevel.F, label: 'F', class: 'tier-f', color: '#dc3545' },
];

export function getTierClass(label: string): string {
    const tier = TIER_CONFIG.find(t => t.label === label.toUpperCase());
    return tier?.class || 'tier-default';
}

export function getTierColor(label: string): string {
    const tier = TIER_CONFIG.find(t => t.label === label.toUpperCase());
    return tier?.color || '#ccc';
}

export function getTierLevelByLabel(label: string): TierLevel {
    const tier = TIER_CONFIG.find(t => t.label === label.toUpperCase());
    return tier?.level ?? TierLevel.F;
}

export function initTierGamesMap(): { [level: number]: GameResponse[] } {
    const map: { [level: number]: GameResponse[] } = {};
    TIER_CONFIG.forEach(t => map[t.level] = []);
    return map;
}