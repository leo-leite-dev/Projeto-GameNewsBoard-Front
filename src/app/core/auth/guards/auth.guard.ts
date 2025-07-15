import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.userService.getAuthenticatedUserSafe().pipe(
      map((user) => {
        if (user?.username) {
          return true;
        }
  
        this.userService.triggerLoginModal();  
        return false;
      })
    );
  }
  
}