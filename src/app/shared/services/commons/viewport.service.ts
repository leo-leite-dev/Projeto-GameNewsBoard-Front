import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly mobileBreakpoint = 768;
  private readonly tabletBreakpoint = 1024;

  private _isMobile$ = new BehaviorSubject<boolean>(this.checkIsMobile());
  private _isTablet$ = new BehaviorSubject<boolean>(this.checkIsTablet());
  private _isDesktop$ = new BehaviorSubject<boolean>(this.checkIsDesktop());

  constructor() {
    fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        this._isMobile$.next(this.checkIsMobile());
        this._isTablet$.next(this.checkIsTablet());
        this._isDesktop$.next(this.checkIsDesktop());
      });
  }

  private checkIsMobile(): boolean {
    return window.innerWidth <= this.mobileBreakpoint;
  }

  private checkIsTablet(): boolean {
    return window.innerWidth <= this.tabletBreakpoint;
  }

  private checkIsDesktop(): boolean {
    return window.innerWidth > this.tabletBreakpoint;
  }

  // Métodos síncronos (uso pontual)
  isMobile(): boolean {
    return this._isMobile$.getValue();
  }

  isTablet(): boolean {
    return this._isTablet$.getValue();
  }

  isDesktop(): boolean {
    return this._isDesktop$.getValue();
  }

  // Observables para uso com reatividade
  isMobile$() {
    return this._isMobile$.asObservable();
  }

  isTablet$() {
    return this._isTablet$.asObservable();
  }

  isDesktop$() {
    return this._isDesktop$.asObservable();
  }
}
