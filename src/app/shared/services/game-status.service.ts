import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { GameResponse } from '../models/game.model';
import { Status } from '../enums/status-game.enum';
import { GameStatusRequest } from '../models/game-status.model';
import { validateApiResponse } from '../utils/api-response-util';

@Injectable({ providedIn: 'root' })
export class GameStatusService {
  private readonly baseUrl = `${environment.apiBaseUrl}/GameStatus`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) { }

  setGameStatus(gameId: number, request: GameStatusRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${gameId}/status`, request).pipe(
      map((response) => validateApiResponse(response, 'definir status')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  removeGameStatus(gameId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${gameId}/status`).pipe(
      map((response) => validateApiResponse(response, 'remover status')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  getMyGameStatuses(): Observable<{ game: GameResponse; status: Status }[]> {
    return this.http
      .get<ApiResponse<{ game: GameResponse; status: Status }[]>>(`${this.baseUrl}/me`)
      .pipe(
        map((response) => {
          const validated = validateApiResponse(response, 'buscar status');
          if (!validated.data) throw new Error('Nenhum status encontrado.');
          return validated.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}