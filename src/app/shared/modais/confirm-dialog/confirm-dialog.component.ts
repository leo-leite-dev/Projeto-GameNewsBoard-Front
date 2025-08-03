import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() message = 'Tem certeza que deseja prosseguir?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
