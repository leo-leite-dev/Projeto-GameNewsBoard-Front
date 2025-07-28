import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { registerIcons } from '../../shareds/icons/fontawesome.icon';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IonicModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(
    library: FaIconLibrary,
    private userService: UserService
  ) {
    registerIcons(library);
  }

  ngOnInit(): void {
    this.userService.refreshUser();
  }
}