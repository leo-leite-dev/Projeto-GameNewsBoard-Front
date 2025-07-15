import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../services/commons/navigation.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(public navigation: NavigationService) {}
}
