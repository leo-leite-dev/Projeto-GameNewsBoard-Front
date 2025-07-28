import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { GameCarouselComponent } from '../../../../../shared/components/game-carousel/game-carousel.component';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { NavigateButtonComponent } from '../../../../../shared/components/buttons/navigate-button/navigate-button.component';
import { AssignTierComponent } from '../../../../../shared/modais/assign-tier/assign-tier.component';
import { GameResponse } from '../../../../../shared/models/game.model';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { ErrorHandlingService } from '../../../../../shared/services/commons/error-handling.service';
import { TierListEntryRequest } from '../../../../../shared/models/tier-list-entry.model';
import { ViewportService } from '../../../../../shared/services/commons/viewport.service';
import { TierLevel } from '../../../../../shared/enums/tier-level.enum';
import { TIER_CONFIG, getTierLevelByLabel, initTierGamesMap } from '../../../../../shared/utils/tier-utils';
import { ToastrService } from 'ngx-toastr';
import { CarouselItem } from '../../../../../shared/models/commons/carousel-item.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
export class AddGameTierListComponent implements OnInit {
  tierId: string | null = null;
  selectedGameTier: string | null = null;
  tierTitle = '';
  errorMessage = '';

  dropListIds: string[] = [];
  tierGames: { [tierLevel: number]: GameResponse[] } = {};
  gameTierMapping: { [gameId: number]: TierLevel } = {};

  selectedGame: CarouselItem | null = null;
  showAssignTierModal = false;
  isMobileView = false;

  readonly tiers = TIER_CONFIG;
  availableTiers = this.tiers.map(t => t.label);

  icon: IconProp = 'times';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tierListService: TierListService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService,
    private viewport: ViewportService
  ) { }

  ngOnInit(): void {
    this.updateViewMode();
    window.addEventListener('resize', this.updateViewMode.bind(this));

    this.route.paramMap.subscribe(params => {
      this.tierId = params.get('tierId');
      this.prepareDropListIds();
      this.initializeTierGames();

      if (this.tierId) {
        this.loadTierListGames(this.tierId);
      }
    });
  }

  private updateViewMode(): void {
    this.isMobileView = this.viewport.isMobile();
  }

  private loadTierListGames(tierId: string): void {
    this.tierListService.getTierById(tierId).subscribe({
      next: tierList => {
        this.tierTitle = tierList.title;
        for (const entry of tierList.entries) {
          const tier = entry.tier;
          const game = entry.game;

          this.tierGames[tier] ||= [];
          this.tierGames[tier].push(game);
          this.gameTierMapping[game.id] = tier;
        }
      },
      error: err => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      }
    });
  }

  private prepareDropListIds(): void {
    this.dropListIds = this.tiers.map(t => `tier-drop-${t.level}`);
  }

  private initializeTierGames(): void {
    this.tierGames = initTierGamesMap();
  }

  onDrop(event: CdkDragDrop<GameResponse[]>, tierLevel: TierLevel): void {
    const game: GameResponse = event.item.data;
    if (!game) return;

    const previousTier = this.gameTierMapping[game.id];
    if (previousTier !== undefined) {
      this.moveGameBetweenTiers(game, previousTier, tierLevel);
    } else {
      this.addGameToTier(game, tierLevel);
    }
  }

  private addGameToTier(game: GameResponse, tierLevel: TierLevel): void {
    this.tierGames[tierLevel] ||= [];
    this.tierGames[tierLevel].push(game);
    this.gameTierMapping[game.id] = tierLevel;

    const request: TierListEntryRequest = {
      gameId: game.id,
      tier: tierLevel
    };

    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => { },
      error: err => this.handleError(err, 'Erro ao adicionar jogo')
    });
  }

  private moveGameBetweenTiers(game: GameResponse, oldTier: TierLevel, newTier: TierLevel): void {
    this.tierGames[oldTier] = this.tierGames[oldTier].filter(g => g.id !== game.id);

    this.tierGames[newTier] ||= [];
    this.tierGames[newTier].push(game);
    this.gameTierMapping[game.id] = newTier;

    const request: TierListEntryRequest = {
      gameId: game.id,
      tier: newTier
    };

    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => { },
      error: err => this.handleError(err, 'Erro ao mover jogo')
    });
  }

  removeGame(game: GameResponse): void {
    const tierLevel = this.gameTierMapping[game.id];
    if (!this.tierId || tierLevel === undefined) return;

    this.tierListService.removeGameFromTier(this.tierId, game.id).subscribe({
      next: () => {
        this.tierGames[tierLevel] = this.tierGames[tierLevel].filter(g => g.id !== game.id);
        delete this.gameTierMapping[game.id];
      },
      error: err => this.handleError(err, 'Erro ao remover jogo')
    });
  }

  private handleError(err: any, contextMsg?: string): void {
    const msg = this.errorHandler.handleHttpError(err);
    this.errorMessage = contextMsg ? `${contextMsg}: ${msg}` : msg;
    this.toastr.error(this.errorMessage);
  }

  getFullCoverUrl(coverImage: string): string {
    return coverImage?.replace('t_thumb', 't_cover_big') ?? '';
  }

  goBack(): void {
    this.router.navigate(['/manage-games']);
  }

  onGameClicked(game: CarouselItem): void {
    this.selectedGame = game;
    const tierLevel = this.gameTierMapping[game.id];
    const foundTier = this.tiers.find(t => t.level === tierLevel);
    this.selectedGameTier = foundTier?.label ?? null;
    this.showAssignTierModal = true;
  }

  onTierSelected(data: { tier: string; game: CarouselItem }): void {
    this.showAssignTierModal = false;

    const newTier = getTierLevelByLabel(data.tier);
    const gameId = data.game.id;

    const request: TierListEntryRequest = {
      gameId,
      tier: newTier
    };

    this.tierListService.setGameTier(this.tierId!, request).subscribe(() => {
    });
  }
}