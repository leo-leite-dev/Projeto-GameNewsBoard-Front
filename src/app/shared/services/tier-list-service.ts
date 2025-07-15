import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import {
  TierList,
  TierListRequest,
  TierListResponse,
  UpdateTierListRequest,
} from '../models/tier-list.model';
import { TierListEntryRequest } from '../models/tier-list-entry.model';

@Injectable({ providedIn: 'root' })
export class TierListService {
  private readonly baseUrl = `${environment.apiBaseUrl}/TierList`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  createTierList(request: TierListRequest): Observable<ApiResponse<TierList>> {
    return this.http
      .post<ApiResponse<TierList>>(`${this.baseUrl}`, request)
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  updateTierList(tierListId: string, request: UpdateTierListRequest): Observable<void> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${tierListId}`, request).pipe(
      map((response) => {
        if (!response.success)
          throw new Error(response.message || 'Erro ao atualizar a tier list.');
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  deleteTierList(tierListId: string): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${tierListId}`).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || 'Erro ao deletar a tier list.');
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  setGameTier(tierListId: string, request: TierListEntryRequest): Observable<void> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${tierListId}/entries`, request).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || 'Erro ao definir tier do jogo.');
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  removeGameFromTier(tierListId: string, gameId: number): Observable<void> {
    const params = new HttpParams().set('gameId', gameId.toString());

    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/${tierListId}/remove-game`, { params })
      .pipe(
        map((response) => {
          if (!response.success)
            throw new Error(response.message || 'Erro ao remover jogo do tier.');
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getTierById(tierId: string): Observable<TierListResponse> {
    return this.http.get<ApiResponse<TierListResponse>>(`${this.baseUrl}/${tierId}`).pipe(
      map((response) => {
        if (!response.success || !response.data) throw new Error('Erro ao carregar tier.');

        return response.data;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  getMyTierLists(): Observable<TierListResponse[]> {
    return this.http.get<ApiResponse<TierListResponse[]>>(`${this.baseUrl}/me`).pipe(
      map((response) => {
        if (!response.success || !response.data) throw new Error('Erro ao carregar suas tiers.');

        return response.data;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }
}
