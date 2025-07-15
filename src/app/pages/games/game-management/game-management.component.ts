import { Component, OnInit } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../../shared/nav/nav-bar/nav-bar.component';
import { LoginComponent } from '../../../shared/modais/login/login.component';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [GenericModule, RouterModule, NavBarComponent, LoginComponent],
  templateUrl: './game-management.component.html',
  styleUrl: './game-management.component.scss',
})
export class GameManagementComponent implements OnInit {
  modalView: 'login' | 'register' | null = null;

  constructor(public userService: UserService) {}

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
