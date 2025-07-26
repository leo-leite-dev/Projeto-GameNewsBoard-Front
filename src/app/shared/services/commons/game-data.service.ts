import { Injectable } from '@angular/core';
import { IgdbGameService } from '../igdb-game.service';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/commons/api-response.model';
import { PaginatedResult } from '../../models/commons/paginated-result.model';
import { GameResponse } from '../../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameDataService {
  constructor(private igdbGameService: IgdbGameService) { }

  loadGames(
    page: number,
    pageSize: number,
    platform: Platform,
    yearCategory: YearCategory,
    searchTerm: string
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const isPlatformFilter = platform !== Platform.All;
    const isYearFilter = yearCategory !== YearCategory.All;

    if (isPlatformFilter) {
      return this.igdbGameService.getGamesByPlatform(page, pageSize, platform, searchTerm);
    }

    if (isYearFilter || hasSearchTerm) {
      return this.igdbGameService.getGamesByYearCategory(page, pageSize, yearCategory, searchTerm);
    }

    return this.igdbGameService.getGames(page, pageSize);
  }
}
