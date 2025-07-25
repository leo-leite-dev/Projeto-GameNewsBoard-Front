import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ApiResponse } from '../../../shared/models/commons/api-response.model';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) { }

  register(data: { username: string; password: string }): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  login(data: { username: string; password: string }): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/login`, data)
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  logout(): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/logout`, {})
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }
}
