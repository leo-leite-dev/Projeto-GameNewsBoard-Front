import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
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
import { combineLatest, Observable } from 'rxjs';
import { LogoutComponent } from '../../modais/logout/logout.component';
import { ModalAuthService } from '../../services/commons/modal-auth.service';

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
export class SideMenuComponent implements OnInit {
  submenuOpen = false;
  menuExpanded = true;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;
  isSmallScreen = false;
  isDropdownOpen = false;

  modalView$!: Observable<'login' | 'register' | null>;
  showLogoutModal$!: Observable<boolean>;

  authenticatedUser$!: Observable<UserProfileResponse | null>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef,
    public modalAuth: ModalAuthService
  ) {
    this.detectScreenSize();
    this.authenticatedUser$ = this.userService.authenticatedUser$;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.detectScreenSize();
  }

  @HostListener('document:click', ['$event'])

  ngOnInit(): void {
    this.modalView$ = this.modalAuth.modalView$;
    this.showLogoutModal$ = this.modalAuth.showLogoutModal$;

    combineLatest([this.modalAuth.modalView$, this.authenticatedUser$]).subscribe(([modalView]) => {
      if (this.isSmallScreen && (modalView === 'login' || modalView === 'register'))
        this.menuExpanded = false;
    });
  }

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
    this.isSmallScreen = window.innerWidth < 600;
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
      this.modalAuth.openLogout();
      return;
    }

    if (item.route) {
      if (item.route === '/manage-games') {
        this.userService.getAuthenticatedUserSafe().subscribe((user) => {
          if (user) {
            this.router.navigate([item.route]);
          } else {
            this.modalAuth.setPendingNavigation(item.route!);
            this.modalAuth.openLogin();
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

  goToProfile() {
    this.router.navigate(['/coming-soon']);

    if (this.isSmallScreen)
      this.menuExpanded = false;
  }
  goToSettings() {
    this.router.navigate(['/coming-soon']);
    
    if (this.isSmallScreen)
      this.menuExpanded = false;
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
