import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-remove-button',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss'],
})
export class RemoveButtonComponent {
  @Input() tooltip = 'Remover';
  @Input() icon: IconProp = 'trash';
  @Output() click = new EventEmitter<Event>();
}
