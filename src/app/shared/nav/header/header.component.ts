import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { UserProfileResponse } from '../../models/user-profile.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isSmallScreen = false;
  @Input() menuExpanded = true;
  @Output() menuToggle = new EventEmitter<void>();

  authenticatedUser$: Observable<UserProfileResponse | null>;
  isDropdownOpen = false;

  constructor(private userService: UserService, private router: Router, private eRef: ElementRef) {
    this.authenticatedUser$ = this.userService.getAuthenticatedUserSafe();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleMenu() {
    this.menuToggle.emit();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile() {
    this.router.navigate(['/perfil']);
    this.isDropdownOpen = false;
  }

  navigateToSettings() {
    this.router.navigate(['/configuracoes']);
    this.isDropdownOpen = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
    this.isDropdownOpen = false;
  }
}
