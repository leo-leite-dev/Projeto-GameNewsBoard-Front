import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ViewportService } from '../../services/commons/viewport.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';

  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  showPassword = false;
  isDisabled = false;
  isMobile = false;

  private destroy$ = new Subject<void>();
  private onChange: (value: string) => void = () => { };
  private onTouchedFn: () => void = () => { };

  constructor(private viewport: ViewportService) { }

  get computedInputType(): string {
    return this.type === 'password' && this.showPassword ? 'text' : this.type;
  }

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

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(): void {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouchedFn();
  }
}