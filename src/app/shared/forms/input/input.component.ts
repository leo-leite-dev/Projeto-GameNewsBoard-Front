import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ViewportService } from '../../services/commons/viewport.service';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FaIconComponent, GenericModule],
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
  @Input() useMobileModal: boolean = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() filterToggle = new EventEmitter<void>();

  value: string = '';
  showPassword = false;
  isDisabled = false;
  isSearchModalOpen = false;
  isMobile = false;

  private onChange: (value: string) => void = () => { };
  private onTouchedFn: () => void = () => { };

  constructor(private viewport: ViewportService) { }

  get computedInputType(): string {
    if (this.type !== 'password') return this.type;
    return this.showPassword ? 'text' : 'password';
  }

  ngOnInit(): void {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = (): void => {
    this.isMobile = this.viewport.isMobile();
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
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  confirmMobileSearch(): void {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.isSearchModalOpen = false;
  }

  toggleFilter(): void {
    this.filterToggle.emit();
  }

  openModal(): void {
    if (this.isMobile && this.useMobileModal) {
      this.isSearchModalOpen = true;
    }
  }
}