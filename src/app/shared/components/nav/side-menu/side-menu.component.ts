import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../header/header.component';
import { combineLatest, firstValueFrom, Observable } from 'rxjs';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { LoginComponent } from '../../../modais/login/login.component';
import { RegisterComponent } from '../../../modais/register/register.component';
import { ConfirmDialogComponent } from '../../../modais/confirm-dialog/confirm-dialog.component';
import { MenuItem } from '../../../models/commons/menu-item.model';
import { UserProfileResponse } from '../../../models/user-profile.model';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserService } from '../../../services/user.service';
import { ModalAuthService } from '../../../services/commons/modal-auth.service';
import { ViewportService } from '../../../services/commons/viewport.service';
import { MobileFooterNavComponent } from '../mobile-footer-nav/mobile-footer-nav.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    MatIconModule,
    LoginComponent,
    RegisterComponent,
    ConfirmDialogComponent,
    MobileFooterNavComponent
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
    public modalAuth: ModalAuthService,
    private viewport: ViewportService
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

    this.authenticatedUser$.subscribe((user) => {
    });

    combineLatest([this.modalAuth.modalView$, this.authenticatedUser$]).subscribe(([modalView, user]) => {
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
    this.isSmallScreen = this.viewport.isMobile();
    this.menuExpanded = !this.isSmallScreen;
  }

  menuItems: MenuItem[] = [
    { label: 'Noticias', icon: 'article', route: '/news' },
    { label: 'Lançamentos', icon: 'event', route: 'game-releases' },
    {
      label: 'Jogos',
      icon: 'gamepad',
      submenu: [
        { label: 'Games Insights', route: '/all-games' },
        { label: 'Gerenciar Jogos', route: '/manage-games' },
      ],
    },
  ];

  async navigateTo(item: MenuItem): Promise<void> {
    if (item.label === 'Sair') {
      this.modalAuth.openLogout();
      return;
    }

    if (item.route === '/manage-games') {
      const user = await firstValueFrom(this.userService.authenticatedUser$);

      if (user) {
        this.router.navigate([item.route]);
      } else {
        this.modalAuth.setPendingNavigation(item.route!);
        this.modalAuth.openLogin();
      }
    } else if (item.route && this.router.url !== item.route) {
      this.router.navigate([item.route]);
    }

    if (this.isSmallScreen) this.menuExpanded = false;

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
    console.log('[SideMenuComponent] Login success! Refreshing user...');
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
      this.router.navigate(['/coming-soon']);
    });
  }
}
