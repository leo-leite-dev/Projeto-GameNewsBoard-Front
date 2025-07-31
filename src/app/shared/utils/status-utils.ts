import { Status } from '../enums/status-game.enum';
import { GameResponse } from '../models/game-reponse.model';

export const MAX_GAMES_PER_DRAWER = 6;

export const STATUS_CONFIG = [
    { value: Status.InProgress, label: 'Em Progresso', class: 'status-inprogress' },
    { value: Status.Platinum, label: 'Platinado', class: 'status-platinum' },
    { value: Status.Replaying, label: 'Rejogando', class: 'status-replaying' },
    { value: Status.Paused, label: 'Pausado', class: 'status-paused' },
    { value: Status.Finished, label: 'Finalizado', class: 'status-finished' },
    { value: Status.Dropped, label: 'Abandonado', class: 'status-dropped' },
];

export function getStatusClass(status: Status): string {
    return STATUS_CONFIG.find(s => s.value === status)?.class || 'status-default';
}

export function getStatusLabel(status: Status): string {
    return STATUS_CONFIG.find(s => s.value === status)?.label || 'Desconhecido';
}

export function mapStatusFromString(value: string): Status | null {
    return Object.values(Status).includes(value as unknown as Status)
        ? (value as unknown as Status)
        : null;
}

export function initStatusGamesMap(): { [key in Status]: GameResponse[] } {
    return Object.values(Status).reduce((acc, status) => {
        acc[status as Status] = [];
        return acc;
    }, {} as { [key in Status]: GameResponse[] });
}

export function initGameDrawerMap(): { [key in Status]: GameResponse[][] } {
    return Object.values(Status).reduce((acc, status) => {
        acc[status as Status] = [];
        return acc;
    }, {} as { [key in Status]: GameResponse[][] });
}