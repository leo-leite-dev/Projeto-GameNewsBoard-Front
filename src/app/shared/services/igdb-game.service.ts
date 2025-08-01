import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PaginatedResult } from '../models/commons/paginated-result.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination.constants';
import { ApiResponse } from '../models/commons/api-response.model';
import { Platform } from '../enums/platform.enum';
import { YearCategory } from '../enums/year-category.enum';
import { GameResponse } from '../models/game-response.model';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class IgdbGameService {
  private readonly baseUrl = `${environment.apiBaseUrl}/games`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  getGames(
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<PaginatedResult<GameResponse>>>(this.baseUrl, { params })
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  getGamesByPlatform(
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE,
    platforms: Platform,
    searchTerm: string = ''
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

    if (platforms !== Platform.All) params = params.set('platform', platforms.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http
      .get<ApiResponse<PaginatedResult<GameResponse>>>(`${this.baseUrl}/get-games-by-platform`, { params })
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  getGamesByYearCategory(
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE,
    yearCategory: YearCategory,
    searchTerm: string = ''
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

    if (yearCategory !== YearCategory.All) params = params.set('yearCategory', yearCategory.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http
      .get<ApiResponse<PaginatedResult<GameResponse>>>(`${this.baseUrl}/get-games-by-year-category`, { params })
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }
}
