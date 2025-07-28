import { Component, OnInit } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';
import { GameResponse } from '../../../../shared/models/game.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Status } from '../../../../shared/enums/status-game.enum';
import { GameStatusService } from '../../../../shared/services/game-status.service';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { ToastrService } from 'ngx-toastr';
import { STATUS_CONFIG, getStatusLabel, initStatusGamesMap } from '../../../../shared/utils/status-utils';
import { AssignStatusComponent } from '../../../../shared/modais/assign-status/assign-status.component';
import { CarouselItem } from '../../../../shared/models/commons/carousel-item.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ViewportService } from '../../../../shared/services/commons/viewport.service';

@Component({
  selector: 'app-game-status-list',
  standalone: true,
  imports: [
    GenericModule,
    GameCarouselComponent,
    DragDropModule,
    AssignStatusComponent
  ],
  templateUrl: './game-status-list.component.html',
  styleUrls: ['./game-status-list.component.scss']
})
export class GameStatusListComponent implements OnInit {
  readonly statusList: Status[] = STATUS_CONFIG.map(s => s.value);
  readonly statuses = STATUS_CONFIG;

  dropListIds: string[] = [];
  statusGames: { [key in Status]: GameResponse[] } = initStatusGamesMap();

  selectedGame: CarouselItem | null = null;
  selectedGameStatus: Status | null = null;
  showAssignStatusModal = false;
  isMobile = false;

  icon: IconProp = 'times';

  constructor(
    private gameStatusService: GameStatusService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService,
    private viewportService: ViewportService
  ) {}

  ngOnInit(): void {
    this.viewportService.isMobile$().subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.dropListIds = ['carousel-drop-list', ...this.statusList.map(status => `status-drop-${status}`)];

    this.gameStatusService.getMyGameStatuses().subscribe({
      next: (statuses) => {
        for (const { game, status } of statuses) {
          this.statusGames[status] ||= [];
          this.statusGames[status].push(game);
        }
      },
      error: (err) => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg || 'Erro ao carregar status dos jogos.');
      }
    });
  }

  onDrop(event: CdkDragDrop<GameResponse[]>, newStatus: Status): void {
    const game = event.item.data as GameResponse;
    if (!game) return;

    const oldStatus = this.getGameCurrentStatus(game.id);
    if (oldStatus !== undefined) {
      this.statusGames[oldStatus] = this.statusGames[oldStatus].filter(g => g.id !== game.id);
    }

    this.statusGames[newStatus].push(game);

    this.gameStatusService.setGameStatus(game.id, newStatus).subscribe({
      next: () => {},
      error: (err) => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg || 'Erro ao atualizar status.');
      }
    });
  }

  removeGame(game: GameResponse): void {
    const status = this.getGameCurrentStatus(game.id);
    if (status === undefined) return;

    this.gameStatusService.removeGameStatus(game.id).subscribe({
      next: () => {
        this.statusGames[status] = this.statusGames[status].filter(g => g.id !== game.id);
      },
      error: (err) => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg || 'Erro ao remover jogo do status.');
      }
    });
  }

  getGameCurrentStatus(gameId: number): Status | undefined {
    return this.statusList.find(status => this.statusGames[status].some(g => g.id === gameId));
  }

  getStatusLabel(status: Status): string {
    return getStatusLabel(status);
  }

  getFullCoverUrl(coverImage: string): string {
    return coverImage?.replace('t_thumb', 't_cover_big') ?? '';
  }

  onGameClicked(game: CarouselItem): void {
    console.log('[MODAL] Jogo clicado:', game);
    this.selectedGame = game;
    this.selectedGameStatus = this.getGameCurrentStatus(game.id) ?? null;
    this.showAssignStatusModal = true;
  }

  onStatusSelected(data: { status: Status; game: CarouselItem }): void {
    this.showAssignStatusModal = false;

    const game = data.game;
    const currentStatus = this.getGameCurrentStatus(game.id);

    if (currentStatus === data.status) return;

    if (currentStatus !== undefined) {
      this.statusGames[currentStatus] = this.statusGames[currentStatus].filter(g => g.id !== game.id);
    }

    this.statusGames[data.status].push(game as GameResponse);

    this.gameStatusService.setGameStatus(game.id, data.status).subscribe({
      next: () => this.toastr.success('Status atualizado com sucesso!'),
      error: (err) => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg || 'Erro ao atualizar status.');
      }
    });
  }
}