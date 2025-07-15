import { Component, OnInit } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';
import { GameResponse } from '../../../../shared/models/game.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Status, StatusLabels } from '../../../../shared/enums/status-game.enum';
import { GameStatusService } from '../../../../shared/services/game-status.service';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game-status-list',
  standalone: true,
  imports: [GenericModule, GameCarouselComponent, DragDropModule],
  templateUrl: './game-status-list.component.html',
  styleUrl: './game-status-list.component.scss',
})
export class GameStatusListComponent implements OnInit {
  dropListIds: string[] = [];
  gameStatus = Status;
  statusLabels = StatusLabels;

  statusList = [
    Status.InProgress,
    Status.Platinum,
    Status.Replaying,
    Status.Paused,
    Status.Finished,
    Status.Dropped,
  ];

  statusGames: { [key in Status]: GameResponse[] } = {} as any;

  constructor(
    private gameStatsuService: GameStatusService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.dropListIds = ['carousel-drop-list', ...this.statusList.map((s) => `status-drop-${s}`)];
    this.statusList.forEach((status) => (this.statusGames[status] = []));

    this.gameStatsuService.getMyGameStatuses().subscribe({
      next: (statuses) => {
        for (const { game, status } of statuses) {
          if (!this.statusGames[status]) {
            this.statusGames[status] = [];
          }
          this.statusGames[status].push(game);
        }
      },
    });
  }

  onDrop(event: CdkDragDrop<GameResponse[]>, newStatus: Status): void {
    console.log('[DROP] Evento disparado:', { event, newStatus });

    const game = event.item.data as GameResponse;
    if (!game) {
      console.warn('[DROP] Nenhum game encontrado no item.data');
      return;
    }

    const oldStatus = this.getGameCurrentStatus(game.id);
    console.log('[DROP] Game:', game.title, '| De:', oldStatus, '→ Para:', newStatus);

    if (oldStatus !== undefined) {
      this.statusGames[oldStatus] = this.statusGames[oldStatus].filter((g) => g.id !== game.id);
    }

    this.statusGames[newStatus].push(game);

    this.gameStatsuService.setGameStatus(game.id, newStatus).subscribe({
      next: () => console.log(`[API] Status atualizado para ${newStatus} com sucesso.`),
      error: (err) => console.error('[API] Erro ao atualizar status:', err),
    });
  }

  removeGame(game: GameResponse): void {
    const status = this.getGameCurrentStatus(game.id);
    if (status === undefined) return;

    this.gameStatsuService.removeGameStatus(game.id).subscribe({
      next: () => {
        this.statusGames[status] = this.statusGames[status].filter((g) => g.id !== game.id);
      },
      error: (err) => {
        const message = this.errorHandler.handleHttpError(err);
        this.toastr.error(message || 'Erro ao remover status do jogo.');
      },
    });
  }

  getGameCurrentStatus(gameId: number): Status | undefined {
    return this.statusList.find((status) => this.statusGames[status].some((g) => g.id === gameId));
  }

  getFullCoverUrl(coverImage: string): string {
    return coverImage?.replace('t_thumb', 't_cover_big') ?? '';
  }
}
