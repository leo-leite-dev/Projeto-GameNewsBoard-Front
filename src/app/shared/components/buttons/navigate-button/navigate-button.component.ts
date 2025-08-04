import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { FaIconComponent } from '../../icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-navigate-button',
  standalone: true,
  imports: [GenericModule, FaIconComponent],
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss'],
})
export class NavigateButtonComponent {
  @Input() label: string = '';
  @Input() className: string = '';
  @Input() icon!: IconProp;
  @Output() click = new EventEmitter<void>();
}
