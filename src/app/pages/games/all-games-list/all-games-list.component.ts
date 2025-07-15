import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../../shared/services/commons/game-data.service';
import { GameResponse } from '../../../shared/models/game.model';
import { GameFilters } from '../../../shared/models/commons/game-filters.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../../shared/constants/pagination.constants';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { GameSearchFilterComponent } from '../../../shared/forms/game-search-filter/game-search-filter.component';
import { Platform } from '../../../shared/enums/platform.enum';
import { YearCategory } from '../../../shared/enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handling.service';
import { ApiResponse } from '../../../shared/models/commons/api-response.model';
import { PaginatedResult } from '../../../shared/models/commons/paginated-result.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../shared/services/commons/notification.service';
import { getPaginatedFallback } from '../../../shared/utils/http-utils';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-all-games-list',
  standalone: true,
  imports: [GenericModule, GamerLoadingComponent, PaginationComponent, GameSearchFilterComponent],
  templateUrl: './all-games-list.component.html',
  styleUrls: ['./all-games-list.component.scss'],
})
export class AllGamesListComponent implements OnInit {
  games: GameResponse[] = [];
  message: string | null = null;
  isLoading = false;
  hasMoreGames = false;
  messageType: 'error' | 'info' = 'info';

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  private filtersChanged$ = new Subject<GameFilters>();
  private destroy$ = new Subject<void>();

  constructor(
    private gameDataService: GameDataService,
    private errorHandler: ErrorHandlingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadGames();

    this.filtersChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => isEqual(a, b)),
        takeUntil(this.destroy$)
      )
      .subscribe((filters) => {
        this.filters = { ...filters };
        this.page = DEFAULT_PAGE;
        this.loadGames();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        next: (res) => this.handleResponse(res),
        error: (err) => this.handleError(err),
      });
  }

  private handleResponse(res: ApiResponse<PaginatedResult<GameResponse>>): void {
    const data = res?.data ?? getPaginatedFallback<GameResponse>(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
    this.games = data.items;
    this.hasMoreGames = data.items.length === this.pageSize;
    this.isLoading = false;
  }

  private handleError(err: HttpErrorResponse): void {
    const errorMsg = this.errorHandler.handleHttpError(err);
    this.games = [];
    this.isLoading = false;
    this.notification.error(errorMsg);
  }

  onFiltersChanged(filters: GameFilters): void {
    this.filters = { ...filters };
    this.page = DEFAULT_PAGE;
    this.loadGames();
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
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    return parts.length === 3 ? parts[2] : null;
  }
}
