import { Component, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { GameFilters } from '../../models/commons/game-filters.model';
import { ViewportService } from '../../services/commons/viewport.service';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-game-search-filter',
  standalone: true,
  imports: [
    InputComponent,
    FilterMenuComponent,
    GenericModule
  ],
  templateUrl: './game-search-filter.component.html',
  styleUrl: './game-search-filter.component.scss',
})
export class GameSearchFilterComponent implements AfterViewInit {
  @Input() icon: IconProp = 'search';

  @ViewChild('mobileInput') mobileInput!: InputComponent;

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  private searchTermSubject = new Subject<string>();

  @Output() filtersChanged = new EventEmitter<GameFilters>();

  faSearch = faSearch;
  faTimes = faTimes;

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

  constructor(private viewportService: ViewportService) {

    this.searchTermSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.emitFilters();
      });
  }

  ngAfterViewInit(): void {
    // ViewChild garantido
  }

  openSearchModal(): void {
    if (!this.mobileInput) {
      console.warn('mobileInput ViewChild não está pronto');
      return;
    }

    // Garantir que a detecção do Angular terminou
    setTimeout(() => {
      this.mobileInput.isSearchModalOpen = true;
    });
  }


  onSearch(value: string): void {
    console.log('[GameSearchFilterComponent] Digitando (modo web):', value);
    this.filters.searchTerm = value;
    this.searchTermSubject.next(value);
  }

  onFilterApplied(filters: {
    platforms: Platform;
    yearCategory: YearCategory;
  }): void {
    this.filters.platform = filters.platforms;
    this.filters.yearCategory = filters.yearCategory;
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChanged.emit({ ...this.filters });
  }
}