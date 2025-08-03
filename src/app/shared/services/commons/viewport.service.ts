import { Injectable, computed, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly mobileBreakpoint = 768;
  private readonly tabletBreakpoint = 1024;

  private readonly _width$ = signal(window.innerWidth);

  constructor() {
    fromEvent(window, 'resize').subscribe(() => {
      this._width$.set(window.innerWidth);
    });
  }

  readonly width = this._width$;

  readonly isMobile = computed(() => this._width$() <= this.mobileBreakpoint);
  readonly isTablet = computed(() => this._width$() <= this.tabletBreakpoint);
  readonly isDesktop = computed(() => this._width$() > this.tabletBreakpoint);
}