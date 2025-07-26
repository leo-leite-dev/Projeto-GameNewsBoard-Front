import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewportService {
    private mobileQuery = window.matchMedia('(max-width: 768px)');

    isMobile(): boolean {
        return this.mobileQuery.matches;
    }

    isTablet(): boolean {
        return window.matchMedia('(max-width: 1024px)').matches;
    }

    isDesktop(): boolean {
        return !this.mobileQuery.matches;
    }
}
