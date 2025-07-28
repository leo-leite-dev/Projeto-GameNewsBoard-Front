import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TIER_CONFIG, getTierClass } from '../../utils/tier-utils';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselItem } from '../../models/commons/carousel-item.model';

@Component({
  selector: 'app-assign-tier',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './assign-tier.component.html',
  styleUrl: './assign-tier.component.scss'
})
export class AssignTierComponent {
  @Input() game!: CarouselItem;
  @Input() availableTiers: string[] = TIER_CONFIG.map(t => t.label);
  @Input() currentTier: string | null = null;

  @Output() tierSelected = new EventEmitter<{ tier: string; game: CarouselItem }>();
  @Output() closed = new EventEmitter<void>();
  

  dismiss() {
    this.closed.emit();
  }

  selectTier(tier: string) {
    this.tierSelected.emit({ tier, game: this.game });
  }

  getTierClassName(tier: string): string {
    return getTierClass(tier);
  }

  getFullCoverUrl(coverImage: string): string {
    return coverImage?.replace('t_thumb', 't_cover_big');
  }
}