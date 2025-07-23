import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GameFilters } from '../../models/commons/game-filters.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-search-filter',
  standalone: true,
  imports: [InputComponent, FilterMenuComponent, FormsModule],
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
      .subscribe(() => {
        this.emitFilters();
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
