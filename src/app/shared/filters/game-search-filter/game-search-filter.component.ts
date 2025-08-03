import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GameFilters } from '../../models/commons/game-filters.model';
import { ViewportService } from '../../services/commons/viewport.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FilterModalComponent } from '../../modais/filter-modal/filter-modal.component';
import { FilterInputComponent } from '../filter-input/filter-input.component';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-game-search-filter',
  standalone: true,
  imports: [
    GenericModule,
    FilterMenuComponent,
    FilterModalComponent,
    FilterInputComponent,
    FaIconComponent
  ],
  templateUrl: './game-search-filter.component.html',
  styleUrl: './game-search-filter.component.scss',
})
export class GameSearchFilterComponent implements AfterViewInit {
  @Input() icon: IconProp = 'search';

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  private searchTermSubject = new Subject<string>();

  @Output() filtersChanged = new EventEmitter<GameFilters>();

  isSearchModalOpen = false;
  filtersOpen = false;

  get isMobile(): boolean {
    return this.viewportService.isMobile();
  }

  platformOptions = Object.keys(Platform)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      platform: Platform[key as keyof typeof Platform],
      name: key.replace(/([A-Z])/g, ' $1').trim(),
    }));

  yearCategoryOptions = Object.keys(YearCategory).map((key) => ({
    category: YearCategory[key as keyof typeof YearCategory],
    name: key.replace(/([A-Z])/g, ' $1').trim(),
  }));

  constructor(public viewportService: ViewportService) {
    this.searchTermSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.emitFilters();
      });
  }

  toggleDesktopFilters() {
    this.filtersOpen = !this.filtersOpen;
  }

  ngAfterViewInit(): void {
    // nada necessário aqui agora
  }

  onSearch(value: string): void {
    this.filters.searchTerm = value;
    this.searchTermSubject.next(value);
  }

  onFilterApplied(filters: { platforms: Platform; yearCategory: YearCategory }): void {
    this.filters.platform = filters.platforms;
    this.filters.yearCategory = filters.yearCategory;
    this.emitFilters();
  }

  onConfirmSearchFromModal(searchTerm: string): void {
    this.filters.searchTerm = searchTerm;
    this.emitFilters();
    this.isSearchModalOpen = false;
  }

  private emitFilters(): void {
    this.filtersChanged.emit({ ...this.filters });
  }

  onOpenMobileSearch(): void {
    console.log('[GameSearchFilterComponent] Evento openMobileSearch recebido → abrindo modal de busca');
    this.isSearchModalOpen = true;
  }
}