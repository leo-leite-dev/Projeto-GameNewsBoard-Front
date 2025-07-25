import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { UserProfileResponse } from '../models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<UserProfileResponse | null>(null);
  authenticatedUser$ = this.userSubject.asObservable();

  private loginModalSubject = new Subject<void>();
  loginModal$ = this.loginModalSubject.asObservable();

  constructor(private http: HttpClient) { }

  triggerLoginModal() {
    this.loginModalSubject.next();
  }

  refreshUser() {
    this.getAuthenticatedUserSafe().subscribe((user) => this.userSubject.next(user));
  }

  clearUser() {
    this.userSubject.next(null);
  }

  getAuthenticatedUserSafe(): Observable<UserProfileResponse | null> {
    return this.http
      .get<ApiResponse<UserProfileResponse>>(`${environment.apiBaseUrl}/user/me`, {
        withCredentials: true
      })
      .pipe(
        map((res) => res.data),
        catchError(() => of(null))
      );
  }
}