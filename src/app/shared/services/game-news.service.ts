import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { GameNewsResponse } from '../models/games-news.model';
import { ErrorHandlingService } from './commons/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class GameNewsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/GameNews`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  getNewsByPlatform(platform: string): Observable<ApiResponse<GameNewsResponse[]>> {
    return this.http.get<ApiResponse<GameNewsResponse[]>>(`${this.baseUrl}/${platform}`).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error('Erro ao carregar notícias.');
        }
        return response;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }
}