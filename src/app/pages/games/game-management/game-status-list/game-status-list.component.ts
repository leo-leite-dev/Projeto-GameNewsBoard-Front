import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';
import { AssignStatusComponent } from '../../../../shared/modais/assign-status/assign-status.component';
import { Status } from '../../../../shared/enums/status-game.enum';
import { CarouselItem } from '../../../../shared/models/commons/carousel-item.model';
import { GameStatusStore } from '../../../../shared/stores/game-status.store';
import { ViewportService } from '../../../../shared/services/commons/viewport.service';
import { getStatusLabel, getValidStatuses } from '../../../../shared/utils/status-utils';
import { FaIconComponent } from '../../../../shared/components/icons/fa-icon/fa-icon.component';

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

  collapsedStatusColumns = new Set<Status>();
  private readonly collapsedStorageKey = 'collapsedStatusColumns';

  constructor(
    private readonly store: GameStatusStore,
    public readonly viewport: ViewportService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.viewport.isMobile();
    this.loadCollapsedColumnsFromStorage();
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

  onDrop(event: CdkDragDrop<CarouselItem[]>, newStatus: Status): void {
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
    this.store.setGameStatus(event.game.id, event.status, event.game);
    this.showAssignStatusModal = false;

    if (this.isMobile && this.collapsedStatusColumns.has(event.status)) {
      this.collapsedStatusColumns.delete(event.status);
      this.saveCollapsedColumnsToStorage();
    }
  }

  toggleCollapse(status: Status): void {
    if (this.collapsedStatusColumns.has(status)) {
      this.collapsedStatusColumns.delete(status);
    } else {
      this.collapsedStatusColumns.add(status);
    }
    this.saveCollapsedColumnsToStorage();
  }

  isCollapsed(status: Status): boolean {
    return this.collapsedStatusColumns.has(status);
  }

  private saveCollapsedColumnsToStorage(): void {
    const array = Array.from(this.collapsedStatusColumns);
    localStorage.setItem(this.collapsedStorageKey, JSON.stringify(array));
  }

  private loadCollapsedColumnsFromStorage(): void {
    const raw = localStorage.getItem(this.collapsedStorageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Status[];
        this.collapsedStatusColumns = new Set(parsed);
      } catch {
        this.collapsedStatusColumns.clear();
      }
    }
  }

  removeGame(game: CarouselItem): void {
    const status = this.store.getGameStatusById(game.id);
    this.store.removeGameStatus(game.id);

    if (status)
      this.hoveredStatus[status] = false;
  }

  showAssignStatusModalFn(): boolean {
    return this.isMobile && this.showAssignStatusModal && this.selectedGame() !== null;
  }

  getFullCoverUrl(img: string): string {
    return img?.replace('/t_thumb/', '/t_cover_big/') ?? '/assets/fallback.jpg';
  }
}