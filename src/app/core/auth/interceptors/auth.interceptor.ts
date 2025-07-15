import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({ withCredentials: true });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthLogin = req.url.includes('/auth/login');
        const isUserMeCheck = req.url.includes('/user/me');

        if (isAuthLogin || isUserMeCheck) 
          return throwError(() => error);
        

        if (error.status === 401 || error.status === 403) {
          this.toastr.error('Sessão expirada. Faça login novamente.', 'Acesso negado');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        }

        if (error.status >= 500) {
          this.toastr.error('Erro interno no servidor', 'Erro');
        }

        return throwError(() => error);
      })
    );
  }
}
