import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FilterMenuComponent } from '../../filters/filter-menu/filter-menu.component';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    GenericModule,
    FilterMenuComponent,
    FaIconComponent
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  @Input() placeholder: string = '';
  @Input() initialValue: string = '';
  @Input() selectedPlatform!: Platform;
  @Input() selectedYearCategory!: YearCategory;
  @Input() platformOptions: { platform: Platform; name: string }[] = [];
  @Input() yearCategoryOptions: { category: YearCategory; name: string }[] = [];

  @Output() filtersApplied = new EventEmitter<{ platforms: Platform; yearCategory: YearCategory }>();
  @Output() searchConfirmed = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  value: string = '';
  isFilterOpen = false;

  ngOnInit(): void {
    this.value = this.initialValue;
  }

  toggleFilterMenu(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  handleFiltersApplied(filters: { platforms: Platform; yearCategory: YearCategory }): void {
    this.isFilterOpen = false;
    this.filtersApplied.emit(filters);
    this.searchConfirmed.emit(this.value);
  }

  confirmMobileSearch(): void {
    this.searchConfirmed.emit(this.value);
  }

  closeModal(): void {
    this.close.emit();
  }
}
