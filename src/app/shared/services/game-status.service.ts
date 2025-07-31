import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { GameResponse } from '../models/game-reponse.model';
import { Status } from '../enums/status-game.enum';

@Injectable({ providedIn: 'root' })
export class GameStatusService {
  private readonly baseUrl = `${environment.apiBaseUrl}/GameStatus`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  setGameStatus(gameId: number, status: Status): Observable<void> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${gameId}/status`, {}, { params }).pipe(
      map((response) => {
        if (!response.success) throw new Error('Erro ao definir status.');
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  removeGameStatus(gameId: number): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${gameId}/status`).pipe(
      map((response) => {
        if (!response.success) throw new Error('Erro ao remover status.');
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  getMyGameStatuses(): Observable<{ game: GameResponse; status: Status }[]> {
    return this.http
      .get<ApiResponse<{ game: GameResponse; status: Status }[]>>(`${this.baseUrl}/me`)
      .pipe(
        map((response) => {
          if (!response.success || !response.data) throw new Error('Erro ao buscar status.');
          return response.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}
