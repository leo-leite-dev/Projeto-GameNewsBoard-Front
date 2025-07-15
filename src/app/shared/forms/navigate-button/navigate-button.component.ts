import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-navigate-button',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss']
})
export class NavigateButtonComponent {
  @Input() label: string = 'Ir';
  @Input() icon?: string;
  @Input() className = '';
  @Output() click = new EventEmitter<void>();
}
