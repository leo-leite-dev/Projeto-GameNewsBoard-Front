import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE
import { YearCategory } from '../../enums/year-category.enum';
import { ViewportService } from '../../services/commons/viewport.service';
import { Platform } from '../../enums/platform.enum';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent {
  @Input() selectedPlatform!: Platform;
  @Input() selectedYearCategory!: YearCategory;
  @Input() platformOptions: { name: string; platform: Platform }[] = [];
  @Input() yearCategoryOptions: { name: string; category: YearCategory }[] = [];

  @Output() filterApplied = new EventEmitter<{ platforms: Platform; yearCategory: YearCategory }>();
  @Output() close = new EventEmitter<void>();

  constructor(public viewport: ViewportService) {}

  Platform = Platform;
  YearCategory = YearCategory;

  tempPlatform: Platform = this.selectedPlatform;
  tempYear: YearCategory = this.selectedYearCategory;

  ngOnInit(): void {
    this.tempPlatform = this.selectedPlatform;
    this.tempYear = this.selectedYearCategory;
  }

  selectPlatform(platform: Platform): void {
    this.tempPlatform = platform;
    if (this.viewport.isMobile()) {
      this.emitFilters();
    }
  }

  selectYearCategory(category: YearCategory): void {
    this.tempYear = category;
    if (this.viewport.isMobile()) {
      this.emitFilters();
    }
  }

  emitFilters(): void {
    this.filterApplied.emit({
      platforms: this.tempPlatform,
      yearCategory: this.tempYear,
    });
  }

  resetFilters(): void {
    this.tempPlatform = Platform.All;
    this.tempYear = YearCategory.All;
    this.emitFilters();
  }
}
