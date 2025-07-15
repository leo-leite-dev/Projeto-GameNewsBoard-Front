import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-dropdown',
  imports: [GenericModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  @Input() options: { id: number | null; name: string }[] = []; // ✅ aqui
  @Input() value: number | null = null; // ✅ permite null para opção "Todos"
  @Input() label: string = 'Selecionar';

  @Output() valueChange = new EventEmitter<number | null>(); // ✅ aceita null

  onChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.value = selectedValue === 'null' ? null : +selectedValue; // ✅ trata null vindo da string
    this.valueChange.emit(this.value);
  }
}