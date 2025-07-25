import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfileResponse } from '../../models/user-profile.model';
import { UserService } from '../../services/user.service';
import { LoginComponent } from '../../modais/login/login.component';
import { RegisterComponent } from '../../modais/register/register.component';
import { ModalAuthService } from '../../services/commons/modal-auth.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ConfirmDialogComponent } from '../../modais/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    LoginComponent,
    RegisterComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() isSmallScreen = false;
  @Input() menuExpanded = true;
  @Output() menuToggle = new EventEmitter<void>();

  authenticatedUser$: Observable<UserProfileResponse | null>;
  modalView$!: Observable<'login' | 'register' | null>;
  showLogoutModal$!: Observable<boolean>;

  isDropdownOpen = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef,
    public modalAuth: ModalAuthService
  ) {
    this.authenticatedUser$ = this.userService.getAuthenticatedUserSafe();
  }

  ngOnInit(): void {
    this.modalView$ = this.modalAuth.modalView$;
    this.showLogoutModal$ = this.modalAuth.showLogoutModal$;
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
    this.router.navigate(['/coming-soon']);
    this.isDropdownOpen = false;
  }

  navigateToSettings() {
    this.router.navigate(['/coming-soon']);
    this.isDropdownOpen = false;
  }

  openLoginModal() {
    this.modalAuth.openLogin();
  }

  openRegisterModal() {
    this.modalAuth.openRegister();
  }

  closeModal() {
    this.modalAuth.closeModal();
  }

  handleLoginSuccess() {
    this.userService.refreshUser();
    this.modalAuth.closeModal();
    this.isDropdownOpen = false;

    const redirect = this.modalAuth.getPendingNavigation();
    if (redirect) {
      this.router.navigate([redirect]);
      this.modalAuth.clearPendingNavigation();
    }
  }

  handleRegisterSuccess() {
    this.modalAuth.openLogin();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.userService.clearUser();
      this.modalAuth.closeLogout();
      this.router.navigate(['/']);
    });
  }
}
