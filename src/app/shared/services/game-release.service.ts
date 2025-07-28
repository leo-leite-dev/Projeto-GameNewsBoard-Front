import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, forkJoin, of, tap } from 'rxjs';
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

  loadGroupedReleases(platform: PlatformFamily, limit = 7): Observable<{
    today: ApiResponse<GameReleaseResponse[]>;
    upcoming: ApiResponse<GameReleaseResponse[]>;
    recent: ApiResponse<GameReleaseResponse[]>;
  }> {
    return forkJoin({
      today: this.getTodayGames(platform).pipe(
        catchError(() =>
          of({ success: false, message: 'Erro ao carregar lançamentos de hoje.', data: [] })
        )
      ),
      upcoming: this.getUpcomingGames(limit, platform).pipe(
        catchError(() =>
          of({ success: false, message: 'Erro ao carregar lançamentos futuros.', data: [] })
        )
      ),
      recent: this.getRecentGames(limit, platform).pipe(
        catchError(() =>
          of({ success: false, message: 'Erro ao carregar lançamentos recentes.', data: [] })
        )
      ),
    });
  }

  loadAllByCategory(
    category: 'upcoming' | 'today' | 'recent',
    platform: PlatformFamily,
    limit = 30
  ): Observable<ApiResponse<GameReleaseResponse[]>> {
    let source$: Observable<ApiResponse<GameReleaseResponse[]>>;

    switch (category) {
      case 'recent':
        source$ = this.getRecentGames(limit, platform);
        break;
      case 'today':
        source$ = this.getTodayGames(platform);
        break;
      default:
        source$ = this.getUpcomingGames(limit, platform);
        break;
    }

    return source$.pipe(
      catchError(err => {
        console.error(`Erro ao carregar jogos (${category})`, err);
        return of({
          success: false,
          message: 'Erro ao carregar os jogos.',
          data: [],
        });
      })
    );
  }
}