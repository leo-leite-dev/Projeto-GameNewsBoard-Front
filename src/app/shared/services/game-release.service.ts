import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ErrorHandlingService } from './commons/error-handling.service';
import { ApiResponse } from '../models/commons/api-response.model';
import { GameReleaseResponse } from '../models/game-release.model';
import { PlatformFamily } from '../enums/platform.enum';

@Injectable({ providedIn: 'root' })
export class GameReleaseService {
  private readonly baseUrl = `${environment.apiBaseUrl}/GameRelease`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) { }

  getTodayGames(platform?: PlatformFamily): Observable<ApiResponse<GameReleaseResponse[]>> {
    let params = new HttpParams();

    if (platform != null)
      params = params.set('platform', platform.toString());

    return this.http
      .get<ApiResponse<GameReleaseResponse[]>>(`${this.baseUrl}/today`, { params })
      .pipe(
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getUpcomingGames(
    daysAhead: number = 7,
    platform?: PlatformFamily
  ): Observable<ApiResponse<GameReleaseResponse[]>> {
    let params = new HttpParams().set('daysAhead', daysAhead.toString());

    if (platform != null)
      params = params.set('platform', platform.toString());

    return this.http
      .get<ApiResponse<GameReleaseResponse[]>>(`${this.baseUrl}/upcoming`, { params })
      .pipe(
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getRecentGames(
    daysBack: number = 7,
    platform?: PlatformFamily
  ): Observable<ApiResponse<GameReleaseResponse[]>> {
    let params = new HttpParams().set('daysBack', daysBack.toString());

    if (platform != null) {
      params = params.set('platform', platform.toString());
    }

    return this.http
      .get<ApiResponse<GameReleaseResponse[]>>(`${this.baseUrl}/recent`, { params })
      .pipe(
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}
