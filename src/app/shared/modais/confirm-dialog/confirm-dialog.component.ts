import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() message = 'Tem certeza que deseja prosseguir?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Input() iconConfirm: IconProp = ['fas', 'check'];
  @Input() iconCancel: IconProp = ['fas', 'times'];

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
