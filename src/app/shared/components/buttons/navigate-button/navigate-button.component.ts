import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-navigate-button',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss'],
})
export class NavigateButtonComponent {
  @Input() icon: IconProp = 'arrow-right';
  @Output() click = new EventEmitter<void>();
}
