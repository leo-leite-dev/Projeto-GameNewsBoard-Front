import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [GenericModule, FaIconComponent],
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
