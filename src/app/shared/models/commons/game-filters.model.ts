import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';

export interface GameFilters {
  searchTerm: string;
  platform: Platform;
  yearCategory: YearCategory;
}