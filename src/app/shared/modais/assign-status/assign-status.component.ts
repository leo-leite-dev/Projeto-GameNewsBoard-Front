import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Status } from '../../enums/status-game.enum';
import { STATUS_CONFIG, getStatusClass, getStatusLabel } from '../../utils/status-utils';
import { GameResponse } from '../../models/game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselItem } from '../../models/commons/carousel-item.model';

@Component({
  selector: 'app-assign-status',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './assign-status.component.html',
  styleUrls: ['./assign-status.component.scss']
})
export class AssignStatusComponent {
  @Input() game!: CarouselItem;
  @Input() currentStatus: Status | null = null;

  @Output() statusSelected = new EventEmitter<{ status: Status; game: CarouselItem }>();
  @Output() closed = new EventEmitter<void>();

  readonly statuses = STATUS_CONFIG;

  getFullCoverUrl(url: string): string {
    return url?.replace('t_thumb', 't_cover_big') ?? '';
  }

  getStatusClass(status: Status): string {
    return getStatusClass(status);
  }

  getStatusLabel(status: Status): string {
    return getStatusLabel(status);
  }

  selectStatus(status: Status): void {
    if (status === this.currentStatus) return;
    this.statusSelected.emit({ status, game: this.game });
  }

  dismiss(): void {
    this.closed.emit();
  }
}