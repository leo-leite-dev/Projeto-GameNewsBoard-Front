import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-app-fa-icon',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './app-fa-icon.component.html',
  styleUrl: './app-fa-icon.component.scss'
})
export class AppFaIconComponent {
  @Input() icon: IconProp = 'times';
  @Input() className = '';
  @Input() spin = false;
  @Input() size?: 'xs' | 'lg' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  @Input() title = '';
}