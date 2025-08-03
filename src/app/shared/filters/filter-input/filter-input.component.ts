import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ViewportService } from '../../services/commons/viewport.service';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() useMobileModal: boolean = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() openMobileSearch = new EventEmitter<void>();

  isMobile: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private viewport: ViewportService) { }

  ngOnInit(): void {
    this.updateMobileState();
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateMobileState());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateMobileState(): void {
    this.isMobile = this.viewport.isMobile();
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(inputValue);
  }

  openModal(): void {
    if (this.isMobile && this.useMobileModal) {
      this.openMobileSearch.emit();
    }
  }
}