import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { TierListRequest, TierListResponse, } from '../models/tier-list.model';
import { TierListEntryRequest } from '../models/tier-list-entry.model';
import { validateApiResponse } from '../utils/api-response-util';

@Injectable({ providedIn: 'root' })
export class TierListService {
  private readonly baseUrl = `${environment.apiBaseUrl}/TierList`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlingService) { }

  createTierList(request: TierListRequest): Observable<ApiResponse<TierListResponse>> {
    return this.http.post<ApiResponse<TierListResponse>>(`${this.baseUrl}`, request).pipe(
      map((response) => validateApiResponse(response, 'criar a tier list')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  updateTierList(tierListId: string, request: TierListRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${tierListId}`, request).pipe(
      map((response) => validateApiResponse(response, 'atualizar a tier list')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  deleteTierList(tierListId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${tierListId}`).pipe(
      map((response) => validateApiResponse(response, 'deletar a tier list')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  setGameTier(tierListId: string, request: TierListEntryRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${tierListId}/entries`, request).pipe(
      map((response) => validateApiResponse(response, 'definir tier do jogo')),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  removeGameFromTier(tierListId: string, gameId: number): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('gameId', gameId.toString());

    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${tierListId}/remove-game`, { params })
      .pipe(
        map((response) => validateApiResponse(response, 'remover jogo do tier')),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getTierById(tierId: string): Observable<TierListResponse> {
    return this.http.get<ApiResponse<TierListResponse>>(`${this.baseUrl}/${tierId}`).pipe(
      map((response) => {
        const validated = validateApiResponse(response, 'carregar tier');
        if (!validated.data) throw new Error('Tier não encontrada.');
        return validated.data;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }

  getMyTierLists(): Observable<TierListResponse[]> {
    return this.http.get<ApiResponse<TierListResponse[]>>(`${this.baseUrl}/me`).pipe(
      map((response) => {
        const validated = validateApiResponse(response, 'carregar suas tiers');
        if (!validated.data) throw new Error('Nenhuma tier encontrada.');
        return validated.data;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }
}
