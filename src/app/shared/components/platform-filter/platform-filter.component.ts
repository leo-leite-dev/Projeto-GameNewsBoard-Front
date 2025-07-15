import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-platform-filter',
  templateUrl: './platform-filter.component.html',
  styleUrls: ['./platform-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class PlatformFilterComponent {
  @Input()
  platforms: { value: any; icon: IconDefinition; label?: string; key: string; }[] = [];
  @Input() selected: any = null;
  @Output() platformChange = new EventEmitter<any>();

  onSelect(platformValue: any): void {
    this.platformChange.emit(platformValue);
  }
}