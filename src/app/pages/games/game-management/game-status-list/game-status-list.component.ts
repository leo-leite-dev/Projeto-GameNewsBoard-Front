import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';
import { AssignStatusComponent } from '../../../../shared/modais/assign-status/assign-status.component';
import { Status } from '../../../../shared/enums/status-game.enum';
import { CarouselItem } from '../../../../shared/models/commons/carousel-item.model';
import { GameStatusStore } from '../../../../shared/stores/game-status.store';
import { ViewportService } from '../../../../shared/services/commons/viewport.service';
import { getStatusLabel, getValidStatuses } from '../../../../shared/utils/status-utils';

@Component({
  selector: 'app-game-status-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FaIconComponent,
    GameCarouselComponent,
    AssignStatusComponent
  ],
  templateUrl: './game-status-list.component.html',
  styleUrl: './game-status-list.component.scss'
})
export class GameStatusListComponent implements OnInit {
  protected readonly statusList = getValidStatuses();
  protected readonly dropListIds = this.statusList.map(s => `status-drop-${s}`);

  protected hoveredStatus: { [key in Status]?: boolean } = {};
  protected selectedGame: WritableSignal<CarouselItem | null> = signal<CarouselItem | null>(null);
  protected selectedGameStatus: Status | null = null;
  protected showAssignStatusModal = false;
  protected isMobile = false;

  constructor(
    private readonly store: GameStatusStore,
    private readonly viewport: ViewportService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.viewport.isMobile();
    this.store.load();
  }

  protected get statusGames() {
    return this.store.statusGames();
  }

  protected get isLoading() {
    return this.store.isLoading();
  }

  getStatusLabel(status: Status): string {
    return getStatusLabel(status);
  }

  onDrop(event: any, newStatus: Status): void {
    const game = event.item.data as CarouselItem;
    this.store.setGameStatus(game.id, newStatus, game);
  }

  onDropListEnter(status: Status): void {
    this.hoveredStatus[status] = true;
  }

  onDropListExit(status: Status): void {
    this.hoveredStatus[status] = false;
  }

  onGameClicked(game: CarouselItem): void {
    if (!this.isMobile) return;
    this.selectedGame.set(game);
    this.selectedGameStatus = this.store.getGameStatusById(game.id) ?? null;
    this.showAssignStatusModal = true;
  }

  onStatusSelected(event: { status: Status; game: CarouselItem }): void {
    this.store.setGameStatus(event.game.id, event.status, event.game); // ✅ Agora o signal é atualizado corretamente
    this.showAssignStatusModal = false;
  }

  removeGame(game: CarouselItem): void {
    this.store.removeGameStatus(game.id);
  }

  showAssignStatusModalFn(): boolean {
    return this.isMobile && this.showAssignStatusModal && this.selectedGame() !== null;
  }

  getFullCoverUrl(img: string): string {
    return img?.replace('/t_thumb/', '/t_cover_big/') ?? '/assets/fallback.jpg';
  }
}