import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { first, Observable } from 'rxjs';
import { UserProfileResponse } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ModalAuthService } from '../../../services/commons/modal-auth.service';

@Component({
  selector: 'app-mobile-footer-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './mobile-footer-nav.component.html',
  styleUrls: ['./mobile-footer-nav.component.scss'],
})
export class MobileFooterNavComponent implements OnInit {
  authenticatedUser$: Observable<UserProfileResponse | null>;
  modalView$!: Observable<'login' | 'register' | null>;
  showLogoutModal$!: Observable<boolean>;

  isDropdownOpen = false;

  constructor(
    private router: Router,
    public userService: UserService,
    private authService: AuthService,
    public modalAuth: ModalAuthService,
    private eRef: ElementRef
  ) {
    this.authenticatedUser$ = this.userService.authenticatedUser$;
  }

  ngOnInit(): void {
    this.modalView$ = this.modalAuth.modalView$;
    this.showLogoutModal$ = this.modalAuth.showLogoutModal$;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  openLogin(): void {
    this.modalAuth.openLogin();
    this.isDropdownOpen = false;
  }

  openRegister(): void {
    this.modalAuth.openRegister();
    this.isDropdownOpen = false;
  }

  navigateWithAuthGuard(path: string): void {
    this.authenticatedUser$.pipe(first()).subscribe(user => {
      if (user) {
        this.navigate(path);
      } else {
        this.modalAuth.setPendingNavigation(path);
        this.openLogin();
      }
    });
  }

  handleProfileClick(): void {
    this.navigateWithAuthGuard('/coming-soon'); 
  }

  handleDashboardClick(): void {
    this.navigateWithAuthGuard('/manage-games');
  }

  openLogout(): void {
    this.modalAuth.openLogout();
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.userService.clearUser();
      this.modalAuth.closeLogout();
      this.isDropdownOpen = false;
      this.navigate('/coming-soon');
    });
  }
}