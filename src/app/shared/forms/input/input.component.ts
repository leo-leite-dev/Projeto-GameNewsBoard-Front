import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

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
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Output() valueChange = new EventEmitter<string>();

  onChange = (_: any) => {};
  onTouched = () => {};
  isDisabled = false;

  ngOnInit(): void {
    if (this.value) this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;

    this.onChange(inputValue);
    this.valueChange.emit(inputValue);
  }
}
