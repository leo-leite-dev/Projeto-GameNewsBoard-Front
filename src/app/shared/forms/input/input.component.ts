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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModule, FontAwesomeModule],
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

  value: string = '';

  @Output() valueChange = new EventEmitter<string>();

  isDisabled = false;
  isSearchModalOpen = false;
  isMobile = false;

  private onChange: (value: string) => void = () => { };
  private onTouchedFn: () => void = () => { };

  ngOnInit(): void {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = (): void => {
    this.isMobile = window.innerWidth <= 480;
  };

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
    console.log('[InputComponent] valor digitado (web):', this.value);
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  confirmMobileSearch(): void {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.isSearchModalOpen = false;
  }
}
