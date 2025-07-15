import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('[GuestGuard] Verificando autenticação do usuário...');

    return this.userService.getAuthenticatedUserSafe().pipe(
      map((userProfile) => {
        console.log('[GuestGuard] Resposta do getAuthenticatedUserSafe():', userProfile);

        if (userProfile?.username) {
          console.warn('[GuestGuard] Usuário já autenticado. Redirecionando para /manage-games...');
          this.router.navigateByUrl('/manage-games');
          return false;
        }

        console.log('[GuestGuard] Usuário não autenticado. Acesso liberado.');
        return true;
      }),
      catchError((err) => {
        console.error('[GuestGuard] Erro ao verificar usuário autenticado:', err);
        return of(true); // libera o acesso mesmo com erro, ou altere conforme necessário
      })
    );
  }
}
