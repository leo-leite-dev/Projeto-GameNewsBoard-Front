import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../../shared/services/commons/game-data.service';
import { GameResponse } from '../../../shared/models/game-response.model';
import { GameFilters } from '../../../shared/models/commons/game-filters.model';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../../shared/constants/pagination.constants';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { GameSearchFilterComponent } from '../../../shared/forms/game-search-filter/game-search-filter.component';
import { Platform } from '../../../shared/enums/platform.enum';
import { YearCategory } from '../../../shared/enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handling.service';
import { NotificationService } from '../../../shared/services/commons/notification.service';
import { getPaginatedFallback } from '../../../shared/utils/http-utils';
import { isEqual } from 'lodash';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ViewportService } from '../../../shared/services/commons/viewport.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FaIconComponent } from '../../../shared/components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-all-games-list',
  standalone: true,
  imports: [
    GenericModule,
    // GamerLoadingComponent,
    // PaginationComponent,
    // GameSearchFilterComponent,
    // DecimalPipe,
    // FaIconComponent
  ],
  templateUrl: './all-games-list.component.html',
  styleUrls: ['./all-games-list.component.scss'],
})
export class AllGamesListComponent implements OnInit {
  games: GameResponse[] = [];
  selectedGame: GameResponse | null = null;
  message: string | null = null;

  isLoading = false;
  hasMoreGames = false;
  showModal = false;
  isMobile = false;

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  selectedGameId: number | null = null;

  private filtersChanged$ = new Subject<GameFilters>();
  private destroy$ = new Subject<void>();

  constructor(
    private gameDataService: GameDataService,
    private errorHandler: ErrorHandlingService,
    private notification: NotificationService,
    private viewport: ViewportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIsMobile();
    window.addEventListener('resize', this.checkIsMobile.bind(this));
    this.loadGames();

    this.filtersChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => isEqual(a, b)),
        takeUntil(this.destroy$)
      )
      .subscribe((filters: GameFilters) => {
        this.filters = { ...filters };
        this.page = DEFAULT_PAGE;
        this.loadGames();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.checkIsMobile.bind(this));
  }

  checkIsMobile(): void {
    this.isMobile = this.viewport.isMobile();
  }

  toggleOverlay(gameId: number): void {
    this.selectedGameId = this.selectedGameId === gameId ? null : gameId;
  }

  isOverlayVisible(gameId: number): boolean {
    return this.isMobile && this.selectedGameId === gameId;
  }

  onCardClick(event: MouseEvent, gameId: number): void {
    const isIcon = (event.target as Element).closest('.toggle-overlay-icon');

    if (this.isMobile) {
      if (!isIcon)
        this.goToComingSoon(gameId);

      else
        this.goToComingSoon(gameId);
    }
  }

  onOverlayClick(event: MouseEvent, gameId: number): void {
    event.stopPropagation();
    if (!this.isMobile)
      this.goToComingSoon(gameId);
  }

  onIconClick(event: MouseEvent, gameId: number): void {
    event.stopPropagation();

    if (this.isMobile) {
      const selected = this.games.find(g => g.id === gameId);
      if (selected) {
        this.selectedGame = selected;
        this.showModal = true;
      }
    } else {
      this.toggleOverlay(gameId);
    }
  }

  loadGames(): void {
    this.isLoading = true;
    this.gameDataService
      .loadGames(
        this.page,
        this.pageSize,
        this.filters.platform,
        this.filters.yearCategory,
        this.filters.searchTerm
      )
      .subscribe({
        next: (res) => {
          const data = res?.data ?? getPaginatedFallback<GameResponse>(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
          this.games = data.items;
          this.hasMoreGames = data.items.length === this.pageSize;
          this.isLoading = false;
        },
        error: (err) => {
          const errorMsg = this.errorHandler.handleHttpError(err);
          this.games = [];
          this.isLoading = false;
          this.notification.error(errorMsg);
        },
      });
  }

  onFiltersChanged(filters: GameFilters): void {
    this.filtersChanged$.next(filters);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.hasMoreGames) {
      this.page++;
      this.loadGames();
    }
  }

  getReleaseYear(dateStr: string | null | undefined): string | null {
    return dateStr?.split('/')?.[2] || null;
  }

  goToComingSoon(gameId: number): void {
    this.router.navigate(['/coming-soon'], { queryParams: { id: gameId } });
  }
}