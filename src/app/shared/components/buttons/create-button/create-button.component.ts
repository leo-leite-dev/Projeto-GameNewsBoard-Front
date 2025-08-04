import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { FaIconComponent } from '../../icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-create-button',
  standalone: true,
  imports: [GenericModule, FaIconComponent],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss'
})
export class CreateButtonComponent {
  @Input() label: string = 'Criar';
  @Input() className = '';

  @Output() buttonClick = new EventEmitter<void>();
}
