import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { NavigateButtonComponent } from '../../../../../shared/components/buttons/navigate-button/navigate-button.component';
import { AssignTierComponent } from '../../../../../shared/modais/assign-tier/assign-tier.component';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { GameCarouselComponent } from '../../../../../shared/components/game-carousel/game-carousel.component';
import { getTierLevelByLabel, initTierGamesMap, TIER_CONFIG } from '../../../../../shared/utils/tier-utils';
import { TierLevel } from '../../../../../shared/enums/tier-level.enum';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { ErrorHandlingService } from '../../../../../shared/services/commons/error-handling.service';
import { ViewportService } from '../../../../../shared/services/commons/viewport.service';
import { TierListEntryRequest } from '../../../../../shared/models/tier-list-entry.model';
import { CarouselItem } from '../../../../../shared/models/commons/carousel-item.model';

@Component({
  selector: 'app-add-game-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    GameCarouselComponent,
    DragDropModule,
    MatTableModule,
    NavigateButtonComponent,
    AssignTierComponent
  ],
  templateUrl: './add-game-tier-list.component.html',
  styleUrls: ['./add-game-tier-list.component.scss']
})
export class AddGameTierListComponent implements OnInit, OnDestroy {
  tierId: string | null = null;
  tierTitle = '';
  dropListIds: string[] = [];
  tierGames: { [tierLevel: number]: CarouselItem[] } = initTierGamesMap();
  gameTierMapping: { [gameId: number]: TierLevel } = {};
  selectedGame: CarouselItem | null = null;
  selectedGameTier: string | null = null;
  showAssignTierModal = false;
  isMobileView = false;
  readonly tiers = TIER_CONFIG;
  availableTiers = this.tiers.map(t => t.label);
  hoveredTiers = {} as Record<TierLevel, boolean>;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tierListService: TierListService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService,
    public viewport: ViewportService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.tierId = params.get('tierId');
        this.prepareDropListIds();
        this.initializeTierGames();
        if (this.tierId) this.loadTierListGames(this.tierId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepareDropListIds(): void {
    this.dropListIds = this.tiers.map(t => `tier-drop-${t.level}`);
  }

  private initializeTierGames(): void {
    this.tierGames = initTierGamesMap();
  }

  onDropListEnter(tiers: TierLevel): void {
    this.hoveredTiers[tiers] = true;
  }

  onDropListExit(tiers: TierLevel): void {
    this.hoveredTiers[tiers] = false;
  }

  private loadTierListGames(tierId: string): void {
    this.tierListService.getTierById(tierId).subscribe({
      next: tierList => {
        this.tierTitle = tierList.title;
        for (const { game, tier } of tierList.entries) {
          this.tierGames[tier] ||= [];
          this.tierGames[tier].push({
            id: game.id,
            title: game.title,
            coverImage: game.coverImage
          });
          this.gameTierMapping[game.id] = tier;
        }
      },
      error: err => this.toastr.error(this.errorHandler.handleHttpError(err))
    });
  }

  onDrop(event: CdkDragDrop<CarouselItem[]>, newTier: TierLevel): void {
    const game = event.item.data as CarouselItem;
    if (!game) return;

    const oldTier = this.getCurrentTier(game.id);
    if (oldTier !== undefined) {
      this.tierGames[oldTier] = this.tierGames[oldTier].filter(g => g.id !== game.id);
    }
    this.tierGames[newTier].push(game);

    const request: TierListEntryRequest = { gameId: game.id, tier: newTier };
    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => this.toastr.success('Tier atualizado com sucesso!'),
      error: err => this.toastr.error(this.errorHandler.handleHttpError(err))
    });
  }

  removeGame(game: CarouselItem): void {
    const tier = this.getCurrentTier(game.id);
    if (tier === undefined) return;

    this.tierListService.removeGameFromTier(this.tierId!, game.id).subscribe({
      next: () => {
        this.tierGames[tier] = this.tierGames[tier].filter(g => g.id !== game.id);
        delete this.gameTierMapping[game.id];
        this.toastr.success('Jogo removido com sucesso!');
      },
      error: err => this.toastr.error(this.errorHandler.handleHttpError(err))
    });
  }

  getCurrentTier(gameId: number): TierLevel | undefined {
    return this.tiers.find(t => this.tierGames[t.level].some(g => g.id === gameId))?.level;
  }

  onGameClicked(game: CarouselItem): void {
    this.selectedGame = game;
    const tier = this.getCurrentTier(game.id);
    this.selectedGameTier = this.tiers.find(t => t.level === tier)?.label ?? null;
    this.showAssignTierModal = true;
  }

  onTierSelected(data: { tier: string; game: CarouselItem }): void {
    this.showAssignTierModal = false;
    const newTier = getTierLevelByLabel(data.tier);
    const game = data.game;
    const oldTier = this.getCurrentTier(game.id);

    if (oldTier === newTier) return;

    if (oldTier !== undefined) {
      this.tierGames[oldTier] = this.tierGames[oldTier].filter(g => g.id !== game.id);
    }
    this.tierGames[newTier].push(game);

    const request: TierListEntryRequest = { gameId: game.id, tier: newTier };
    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => this.toastr.success('Tier atualizado com sucesso!'),
      error: err => this.toastr.error(this.errorHandler.handleHttpError(err))
    });
  }

  getFullCoverUrl(coverImage: string): string {
    return coverImage?.replace('t_thumb', 't_cover_big') ?? '';
  }

  goBack(): void {
    this.router.navigate(['/manage-games']);
  }
}