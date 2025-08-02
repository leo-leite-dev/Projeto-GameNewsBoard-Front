import { Injectable, computed, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly mobileBreakpoint = 768;
  private readonly tabletBreakpoint = 1024;

  private width = signal(window.innerWidth);

  constructor() {
    fromEvent(window, 'resize').subscribe(() => {
      this.width.set(window.innerWidth);
    });
  }

  readonly isMobile = computed(() => this.width() <= this.mobileBreakpoint);
  readonly isTablet = computed(() => this.width() <= this.tabletBreakpoint);
  readonly isDesktop = computed(() => this.width() > this.tabletBreakpoint);
}