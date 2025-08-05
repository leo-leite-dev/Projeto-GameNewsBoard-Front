import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

export interface PlatformOption<T = unknown> {
  value: T;
  icon: IconDefinition;
  label?: string;
  key: string;
}

@Component({
  selector: 'app-platform-filter',
  templateUrl: './platform-filter.component.html',
  styleUrls: ['./platform-filter.component.scss'],
  standalone: true,
  imports: [GenericModule]
})
export class PlatformFilterComponent<T = unknown> {
  @Input() platforms: PlatformOption<T>[] = [];
  @Input() selected: T | null = null;
  @Output() platformChange = new EventEmitter<T>();

  onSelect(platformValue: T): void {
    this.platformChange.emit(platformValue);
  }
}
