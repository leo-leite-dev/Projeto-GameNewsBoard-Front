import { Component, OnInit } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../../shared/modais/login/login.component';
import { UserService } from '../../../shared/services/user.service';
import { NavBarComponent } from '../../../shared/components/nav/nav-bar/nav-bar.component';
import { RegisterComponent } from '../../../shared/modais/register/register.component';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    NavBarComponent,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './game-management.component.html',
  styleUrl: './game-management.component.scss',
})
export class GameManagementComponent implements OnInit {
  modalView: 'login' | 'register' | null = null;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.loginModal$.subscribe(() => {
      this.modalView = 'login';
    });
  }

  handleLoginSuccess() {
    this.userService.refreshUser();
    this.modalView = null;
  }

  closeModal() {
    this.modalView = null;
  }
}