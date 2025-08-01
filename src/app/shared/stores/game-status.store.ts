import { Injectable, computed, signal } from '@angular/core';
import { GameStatusService } from '../services/game-status.service';
import { ToastrService } from 'ngx-toastr';
import { Status } from '../enums/status-game.enum';
import { CarouselItem } from '../models/commons/carousel-item.model';
import { mapGameToCarouselItem } from '../mappers/game.mapper';
import { initStatusGamesMap } from '../utils/status-utils';

type StatusGamesMap = { [key in Status]: CarouselItem[] };

@Injectable({ providedIn: 'root' })
export class GameStatusStore {
    private loaded = false;

    private _statusGames = signal<StatusGamesMap>(initStatusGamesMap());
    private _isLoading = signal(false);
    private _error = signal<string | null>(null);

    readonly statusGames = computed(() => this._statusGames());
    readonly isLoading = computed(() => this._isLoading());
    readonly error = computed(() => this._error());

    constructor(
        private readonly gameStatusService: GameStatusService,
        private readonly toastr: ToastrService
    ) { }

    load(): void {
        if (this.loaded) return;

        this._isLoading.set(true);
        this._error.set(null);

        this.gameStatusService.getMyGameStatuses().subscribe({
            next: (statuses) => {
                const map = initStatusGamesMap();

                for (const { game, status } of statuses) {
                    const item = mapGameToCarouselItem(game);
                    map[status].push(item);
                }

                this._statusGames.set(map);
                this._isLoading.set(false);
                this.loaded = true;
            },
            error: () => {
                this._isLoading.set(false);
                this._error.set('Erro ao carregar status dos jogos.');
                this.toastr.error('Erro ao carregar status dos jogos.');
            }
        });
    }

    setGameStatus(gameId: number, newStatus: Status, game?: CarouselItem): void {
        this._statusGames.update(current => {
            const cloned: StatusGamesMap = structuredClone(current);

            const oldStatus = this.getGameStatusById(gameId);
            if (oldStatus) {
                cloned[oldStatus] = cloned[oldStatus].filter(g => g.id !== gameId);
            }

            const gameToAdd = game ?? this.getGameById(gameId);
            if (gameToAdd) {
                cloned[newStatus].push(gameToAdd);
            }

            return cloned;
        });

        this.gameStatusService.setGameStatus(gameId, newStatus).subscribe({
            next: () => this.toastr.success('Status atualizado com sucesso!'),
            error: () => this.toastr.error('Erro ao atualizar status.')
        });
    }

    removeGameStatus(gameId: number): void {
        this._statusGames.update(current => {
            const cloned: StatusGamesMap = structuredClone(current);

            const status = this.getGameStatusById(gameId);
            if (status) {
                cloned[status] = cloned[status].filter(g => g.id !== gameId);
            }

            return cloned;
        });

        this.gameStatusService.removeGameStatus(gameId).subscribe({
            next: () => this.toastr.success('Removido com sucesso!'),
            error: () => this.toastr.error('Erro ao remover jogo.')
        });
    }

    getGameStatusById(gameId: number): Status | undefined {
        const current = this._statusGames();
        return (Object.keys(current) as unknown as Status[]).find(
            status => current[status].some(g => g.id === gameId)
        );
    }

    getGameById(gameId: number): CarouselItem | undefined {
        const status = this.getGameStatusById(gameId);
        if (!status) return undefined;
        return this._statusGames()[status].find(g => g.id === gameId);
    }
}