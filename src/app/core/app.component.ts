import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { registerIcons } from '../../shareds/icons/fontawesome.icon';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IonicModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(library: FaIconLibrary) {
    registerIcons(library);
  }
}
