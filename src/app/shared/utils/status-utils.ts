import { Status } from '../enums/status-game.enum';
import { CarouselItem } from '../models/commons/carousel-item.model';

export const MAX_GAMES_PER_DRAWER = 6;

export const STATUS_CONFIG = [
    { value: Status.InProgress, label: 'Em Progresso', class: 'status-inprogress' },
    { value: Status.Dropped, label: 'Abandonado', class: 'status-dropped' },
    { value: Status.Finished, label: 'Finalizado', class: 'status-finished' },
    { value: Status.Platinum, label: 'Platinado', class: 'status-platinum' },
    { value: Status.Replaying, label: 'Rejogando', class: 'status-replaying' },
    { value: Status.Backlog, label: 'Backlog', class: 'status-backlog' },
    { value: Status.Paused, label: 'Pausado', class: 'status-paused' },
];

export function getStatusClass(status: Status): string {
    return STATUS_CONFIG.find(s => s.value === status)?.class || 'status-default';
}

export function getStatusLabel(status: Status): string {
    return STATUS_CONFIG.find(s => s.value === status)?.label || 'Desconhecido';
}

export function initStatusGamesMap(): { [key in Status]: CarouselItem[] } {
    return Object.values(Status)
        .filter((value) => !isNaN(Number(value)))
        .reduce((acc, value) => {
            const status = Number(value) as Status;
            acc[status] = [];
            return acc;
        }, {} as { [key in Status]: CarouselItem[] });
}

export function getValidStatuses(): Status[] {
    return Object.values(Status)
        .filter((value) => typeof value === 'number')
        .filter((status) =>
            status !== Status.Platinum
        ) as Status[];
}