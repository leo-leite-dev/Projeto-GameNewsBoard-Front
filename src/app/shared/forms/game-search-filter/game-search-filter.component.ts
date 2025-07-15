import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GameFilters } from '../../models/commons/game-filters.model';

@Component({
  selector: 'app-game-search-filter',
  standalone: true,
  imports: [InputComponent, FilterMenuComponent],
  templateUrl: './game-search-filter.component.html',
  styleUrl: './game-search-filter.component.scss'
})
export class GameSearchFilterComponent {
  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All
  };

  private searchTermSubject = new Subject<string>();

  @Output() filtersChanged = new EventEmitter<GameFilters>();

  platformOptions = Object.keys(Platform)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      platform: Platform[key as keyof typeof Platform],
      name: key.replace(/([A-Z])/g, ' $1').trim()
    }));

  yearCategoryOptions = Object.keys(YearCategory).map(key => ({
    category: YearCategory[key as keyof typeof YearCategory],
    name: key.replace(/([A-Z])/g, ' $1').trim()
  }));

  constructor() {
    this.searchTermSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => {
        this.filters.searchTerm = term;
        this.emitFilters();
      });
  }

  onSearch(term: string): void {
    this.searchTermSubject.next(term);
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
