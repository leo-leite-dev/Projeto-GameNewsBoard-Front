import { Component, Input, OnInit } from "@angular/core";
import { GenericModule } from "../../../../shareds/commons/GenericModule";
import { GamerLoadingComponent } from "../gamer-loading/gamer-loading.component";
import { GameSearchFilterComponent } from "../../forms/game-search-filter/game-search-filter.component";
import { CarouselComponent } from "../carousel/carousel.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GameResponse } from "../../models/game.model";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../constants/pagination.constants";
import { GameFilters } from "../../models/commons/game-filters.model";
import { Platform } from "../../enums/platform.enum";
import { YearCategory } from "../../enums/year-category.enum";
import { debounceTime, distinctUntilChanged, Subject, Subscription } from "rxjs";
import { GameDataService } from "../../services/commons/game-data.service";

@Component({
  selector: 'app-game-carousel',
  standalone: true,
  imports: [
    GenericModule,
    GamerLoadingComponent,
    GameSearchFilterComponent,
    CarouselComponent,
    DragDropModule,
    FontAwesomeModule,
  ],
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit {
  @Input() connectedDropLists: string[] = [];

  games: GameResponse[] = [];
  filteredGames: GameResponse[] = [];
  isLoading = true;

  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  private loadSubscription?: Subscription;
  private filtersChanged$ = new Subject<GameFilters>();

  constructor(private gameDataService: GameDataService) {}

  ngOnInit(): void {
    this.loadGames();

    this.filtersChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((filters) => {
        this.filters = { ...filters };
        this.loadFilteredGames();
      });
  }

  private loadGames(): void {
    this.isLoading = true;

    this.loadSubscription = this.gameDataService
      .loadGames(1, 100, Platform.All, YearCategory.All, '')
      .subscribe({
        next: (response) => {
          const newGames = response.data.items;
          this.games = [...newGames, ...newGames];
          this.filteredGames = [...this.games];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('[Carousel] Erro ao carregar jogos:', error);
          this.isLoading = false;
        },
      });
  }

  private loadFilteredGames(): void {
    const { searchTerm, platform, yearCategory } = this.filters;
    const hasSearchTerm = searchTerm.trim().length > 0;

    if (!hasSearchTerm && platform === Platform.All && yearCategory === YearCategory.All) {
      this.filteredGames = [...this.games];
      return;
    }

    this.isLoading = true;

    this.gameDataService
      .loadGames(this.page, this.pageSize, platform, yearCategory, searchTerm)
      .subscribe({
        next: (response) => {
          this.filteredGames = response.data.items;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('[Carousel] Erro ao buscar jogos:', error);
          this.filteredGames = [];
          this.isLoading = false;
        },
      });
  }

  onFiltersChanged(filters: GameFilters): void {
    this.filtersChanged$.next(filters);
  }
}