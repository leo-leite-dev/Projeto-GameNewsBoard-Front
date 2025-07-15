import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  goToGameTierList() {
    this.router.navigate(['/nav-bar/tier-list']);
  }

  goToGameStatusList() {
    this.router.navigate(['/nav-bar/status-list']);
  }
}
