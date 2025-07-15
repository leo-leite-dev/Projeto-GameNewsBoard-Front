import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { YearCategory } from '../../enums/year-category.enum';
import { Platform } from '../../enums/platform.enum';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent {
  @Input() selectedPlatform!: Platform;
  @Input() selectedYearCategory!: YearCategory;

  @Input() platformOptions: { platform: Platform; name: string }[] = [];
  @Input() yearCategoryOptions: { category: YearCategory; name: string }[] = [];

  @Output() filterApplied = new EventEmitter<{
    platforms: Platform;
    yearCategory: YearCategory;
  }>();

  showFilterMenu = false;

  Platform = Platform;
  YearCategory = YearCategory;

  currentPlatform!: Platform;
  currentYearCategory!: YearCategory;

  ngOnInit(): void {
    this.currentPlatform = this.selectedPlatform;
    this.currentYearCategory = this.selectedYearCategory;
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;

    if (this.showFilterMenu) {
      this.currentPlatform = this.selectedPlatform;
      this.currentYearCategory = this.selectedYearCategory;
    }
  }

  onPlatformChange(platform: Platform) {
    this.currentPlatform = platform;
    this.currentYearCategory = YearCategory.All;
  }

  onYearCategoryChange(category: YearCategory) {
    this.currentYearCategory = category;
    this.currentPlatform = Platform.All;
  }

  resetFilters(): void {
    this.currentPlatform = Platform.All;
    this.currentYearCategory = YearCategory.All;
    this.applyFilters();
  }

  applyFilters() {
    this.showFilterMenu = false;
    this.filterApplied.emit({
      platforms: this.currentPlatform,
      yearCategory: this.currentYearCategory,
    });
  }
}
