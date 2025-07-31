import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../services/commons/navigation.service';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';
import { ViewportService } from '../../services/commons/viewport.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports:
    [
      RouterModule,
      GenericModule,
      FaIconComponent,
      FontAwesomeModule
    ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  isMobile = false;

  constructor(
    public navigation: NavigationService,
    private viewport: ViewportService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.viewport.isMobile();
  }
}