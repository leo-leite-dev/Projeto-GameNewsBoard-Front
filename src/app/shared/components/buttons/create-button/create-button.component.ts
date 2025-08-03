import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-create-button',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss'
})
export class CreateButtonComponent {
  @Input() label: string = 'Ir';
  @Input() className = '';

  @Output() buttonClick = new EventEmitter<void>();
}
