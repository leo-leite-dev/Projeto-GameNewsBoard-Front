import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FilterMenuComponent } from '../../filters/filter-menu/filter-menu.component';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    GenericModule,
    FilterMenuComponent,
    FaIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() initialValue: string = '';
  @Input() selectedPlatform!: Platform;
  @Input() selectedYearCategory!: YearCategory;
  @Input() platformOptions: { platform: Platform; name: string }[] = [];
  @Input() yearCategoryOptions: { category: YearCategory; name: string }[] = [];

  @Output() filtersApplied = new EventEmitter<{ platforms: Platform; yearCategory: YearCategory }>();
  @Output() searchConfirmed = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  isFilterOpen = false;
  searchForm!: FormGroup;

  Platform = Platform;
  YearCategory = YearCategory;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [this.initialValue, [Validators.required, Validators.pattern(/\S+/)]]
    });
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  toggleFilterMenu(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onFilterApplied(event: { platforms: Platform; yearCategory: YearCategory }) {
    this.selectedPlatform = event.platforms;
    this.selectedYearCategory = event.yearCategory;
    this.isFilterOpen = false;
  }

  clearPlatform(): void {
    console.log('[clearPlatform] Resetando plataforma para All');
    this.selectedPlatform = Platform.All;
    this.filtersApplied.emit({
      platforms: this.selectedPlatform,
      yearCategory: this.selectedYearCategory,
    });
    this.cdr.detectChanges();
  }

  clearYearCategory(): void {
    console.log('[clearYearCategory] Resetando categoria de ano para All');
    this.selectedYearCategory = YearCategory.All;
    this.filtersApplied.emit({
      platforms: this.selectedPlatform,
      yearCategory: this.selectedYearCategory,
    });
    this.cdr.detectChanges();
  }

  confirmMobileSearch(): void {
    const search = this.searchControl?.value?.trim();
    const hasSearch = !!search;
    const hasPlatformFilter = this.selectedPlatform !== Platform.All;
    const hasYearFilter = this.selectedYearCategory !== YearCategory.All;

    console.log('[confirmMobileSearch]');
    console.log('search:', search);
    console.log('hasSearch:', hasSearch);
    console.log('selectedPlatform:', this.selectedPlatform, 'hasPlatformFilter:', hasPlatformFilter);
    console.log('selectedYearCategory:', this.selectedYearCategory, 'hasYearFilter:', hasYearFilter);

    // 🚨 Se nada estiver preenchido, não faz nada
    if (!hasSearch && !hasPlatformFilter && !hasYearFilter) {
      console.warn('Nenhuma busca ou filtro definido. Abortando...');
      this.searchForm.markAllAsTouched();
      return;
    }

    // ✅ Se texto estiver presente, emite busca
    if (hasSearch) {
      console.log('Emitindo searchConfirmed:', search);
      this.searchConfirmed.emit(search);
    }

    // ✅ Se filtros estiverem aplicados, emite filtro
    if (hasPlatformFilter || hasYearFilter) {
      console.log('Emitindo filtersApplied:', {
        platforms: this.selectedPlatform,
        yearCategory: this.selectedYearCategory,
      });
      this.filtersApplied.emit({
        platforms: this.selectedPlatform,
        yearCategory: this.selectedYearCategory,
      });
    }

    this.closeModal();
  }


  isSearchEnabled(): boolean {
    const search = this.searchControl?.value?.trim();
    const hasSearch = !!search;
    const hasPlatformFilter = this.selectedPlatform !== Platform.All;
    const hasYearFilter = this.selectedYearCategory !== YearCategory.All;
    return hasSearch || hasPlatformFilter || hasYearFilter;
  }

  closeModal(): void {
    this.close.emit();
  }

  getPlatformName(platform: Platform): string {
    return this.platformOptions.find(p => p.platform === platform)?.name || '';
  }

  getYearCategoryName(category: YearCategory): string {
    return this.yearCategoryOptions.find(c => c.category === category)?.name || '';
  }
}