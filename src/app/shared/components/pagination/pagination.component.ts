import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() hasNext = false;

  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPrevious(): void {
    if (this.page > 1) this.previous.emit();
  }

  onNext(): void {
    if (this.hasNext) this.next.emit();
  }
}