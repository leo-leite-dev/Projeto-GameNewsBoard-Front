import { Component, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/commons/menu-item.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../../modais/login/login.component';
import { RegisterComponent } from '../../modais/register/register.component';
import { UserProfileResponse } from '../../models/user-profile.model';
import { Observable } from 'rxjs';
import { LogoutComponent } from '../../modais/logout/logout.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    MatIconModule,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  submenuOpen = false;
  menuExpanded = true;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;
  isSmallScreen: boolean = false;
  modalView: 'login' | 'register' | null = null;
  showLoginModal = false;
  showLogoutModal = false;
  isDropdownOpen = false;

  authenticatedUser$!: Observable<UserProfileResponse | null>;
  pendingNavigationAfterLogin: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.detectScreenSize();
    this.authenticatedUser$ = this.userService.authenticatedUser$;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectScreenSize();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (
      this.isDropdownOpen &&
      this.eRef.nativeElement &&
      !this.eRef.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }

  detectScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 800;
    this.menuExpanded = !this.isSmallScreen;
  }

  menuItems: MenuItem[] = [
    { label: 'Noticias', icon: 'article', route: '/news' },
    { label: 'Lançamentos', icon: 'event', route: 'game-releases' },
    {
      label: 'Jogos',
      icon: 'gamepad',
      submenu: [
        { label: 'Todos os Jogos', route: '/all-games' },
        { label: 'Gerenciar Jogos', route: '/manage-games' },
      ],
    },
  ];

  navigateTo(item: MenuItem): void {
    if (item.label === 'Sair') {
      this.openLogoutModal();
      return;
    }

    if (item.route) {
      if (item.route === '/manage-games') {
        this.userService.getAuthenticatedUserSafe().subscribe((user) => {
          if (user) {
            this.router.navigate([item.route]);
          } else {
            this.pendingNavigationAfterLogin = item.route!;
            this.openLoginModal();
          }
        });
      } else if (this.router.url !== item.route) {
        this.router.navigate([item.route]);
      }
    }

    if (this.isSmallScreen) {
      this.menuExpanded = false;
    }

    this.submenuOpen = false;
    this.selectedMenuTitle = null;
    this.activeSubmenu = null;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      if (!this.menuExpanded && !this.isSmallScreen) {
        this.menuExpanded = true;
        setTimeout(() => {
          this.selectedMenuTitle = item.label;
        }, 300);
      } else {
        this.selectedMenuTitle = this.selectedMenuTitle === item.label ? null : item.label;
      }
    } else {
      this.navigateTo(item);
    }
  }

  toggleMenu(): void {
    this.menuExpanded = !this.menuExpanded;
  }

  goToProfile() {}
  goToSettings() {}

  closeModal() {
    this.modalView = null;
  }

  openLoginModal() {
    this.modalView = 'login';
  }

  openRegisterModal() {
    this.modalView = 'register';
  }

  handleLoginSuccess() {
    this.userService.refreshUser();
    this.closeModal();

    this.isDropdownOpen = false;

    if (this.pendingNavigationAfterLogin) {
      this.router.navigate([this.pendingNavigationAfterLogin]);
      this.pendingNavigationAfterLogin = null;
    }
  }

  handleRegisterSuccess() {
    this.modalView = 'login';
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.userService.clearUser();
      this.showLogoutModal = false;
      this.router.navigate(['/']);
    });
  }
}
