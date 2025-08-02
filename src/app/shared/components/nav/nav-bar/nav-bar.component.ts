import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgIf } from '@angular/common';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { NavigationService } from '../../../services/commons/navigation.service';
import { ViewportService } from '../../../services/commons/viewport.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    GenericModule,
    FaIconComponent,
    FontAwesomeModule,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(
    public navigation: NavigationService,
    public viewport: ViewportService
  ) {}
}