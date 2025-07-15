import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GameCarouselComponent } from '../../../../../shared/components/game-carousel/game-carousel.component';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { MatTableModule } from '@angular/material/table';
import { GameResponse } from '../../../../../shared/models/game.model';
import { TierLevel } from '../../../../../shared/enums/tier-level.enum';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../../../../../shared/services/commons/error-handling.service';
import { TierListEntryRequest } from '../../../../../shared/models/tier-list-entry.model';
import { NavigateButtonComponent } from '../../../../../shared/forms/navigate-button/navigate-button.component';

@Component({
  selector: 'app-add-game-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    GameCarouselComponent,
    DragDropModule,
    MatTableModule,
    FontAwesomeModule,
    NavigateButtonComponent,
  ],
  templateUrl: './add-game-tier-list.component.html',
  styleUrls: ['./add-game-tier-list.component.scss'],
})
export class AddGameTierListComponent implements OnInit {
  tierId: string | null = null;
  dropListIds: string[] = [];
  tierTitle: string = '';
  errorMessage: string = '';
  viewOnlyMode = false;

  tierGames: { [tierLevel: number]: GameResponse[] } = {};
  gameTierMapping: { [gameId: number]: TierLevel } = {};

  isMobileView = false;

  readonly tiers = [
    { level: TierLevel.SSS, label: 'SSS' },
    { level: TierLevel.SS, label: 'SS' },
    { level: TierLevel.S, label: 'S' },
    { level: TierLevel.A, label: 'A' },
    { level: TierLevel.C, label: 'C' },
    { level: TierLevel.D, label: 'D' },
    { level: TierLevel.F, label: 'F' },
  ];

  constructor(
    private route: ActivatedRoute,
    private tierListService: TierListService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateViewMode();

    window.addEventListener('resize', this.updateViewMode.bind(this));

    this.route.paramMap.subscribe((params) => {
      this.tierId = params.get('tierId');
      this.prepareDropListIds();
      this.initializeTierGames();

      if (this.tierId) {
        this.loadTierListGames(this.tierId);
      }
    });
  }
  private updateViewMode(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  private loadTierListGames(tierId: string): void {
    this.tierListService.getTierById(tierId).subscribe({
      next: (tierList) => {
        this.tierTitle = tierList.title;
        for (const entry of tierList.entries) {
          const tier = entry.tier;
          const game = entry.game;

          if (!this.tierGames[tier]) {
            this.tierGames[tier] = [];
          }

          this.tierGames[tier].push(game);
          this.gameTierMapping[game.id] = tier;
        }
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      },
    });
  }

  private prepareDropListIds(): void {
    this.dropListIds = this.tiers.map((t) => `tier-drop-${t.level}`);
  }

  private initializeTierGames(): void {
    this.tiers.forEach((tier) => {
      this.tierGames[tier.level] = [];
    });
  }

  onDrop(event: CdkDragDrop<GameResponse[]>, tierLevel: TierLevel): void {
    const game: GameResponse = event.item.data;

    if (!game) {
      console.warn('Nenhum jogo encontrado no drop.');
      return;
    }

    const previousTier = this.gameTierMapping[game.id];

    if (previousTier !== undefined) {
      this.moveGameBetweenTiers(game, previousTier, tierLevel);
    } else {
      this.addGameToTier(game, tierLevel);
    }
  }

  private addGameToTier(game: GameResponse, tierLevel: TierLevel): void {
    if (!this.tierGames[tierLevel]) {
      this.tierGames[tierLevel] = [];
    }

    this.tierGames[tierLevel].push(game);
    this.gameTierMapping[game.id] = tierLevel;

    const request: TierListEntryRequest = {
      gameId: game.id,
      tier: tierLevel,
    };

    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => {},
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      },
    });
  }

  removeGame(game: GameResponse): void {
    const tierLevel = this.gameTierMapping[game.id];
    if (!this.tierId || tierLevel === undefined) return;

    this.tierListService.removeGameFromTier(this.tierId, game.id).subscribe({
      next: () => {
        this.tierGames[tierLevel] = this.tierGames[tierLevel].filter((g) => g.id !== game.id);
        delete this.gameTierMapping[game.id];
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      },
    });
  }

  private moveGameBetweenTiers(game: GameResponse, oldTier: TierLevel, newTier: TierLevel): void {
    this.tierGames[oldTier] = this.tierGames[oldTier].filter((g) => g.id !== game.id);

    if (!this.tierGames[newTier]) {
      this.tierGames[newTier] = [];
    }

    this.tierGames[newTier].push(game);
    this.gameTierMapping[game.id] = newTier;

    const request: TierListEntryRequest = {
      gameId: game.id,
      tier: newTier,
    };

    this.tierListService.setGameTier(this.tierId!, request).subscribe({
      next: () => {},
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      },
    });
  }

  getFullCoverUrl(coverImage: string): string {
    if (!coverImage) {
      return '';
    }
    return coverImage.replace('t_thumb', 't_cover_big');
  }

  toggleViewMode(): void {
    this.viewOnlyMode = !this.viewOnlyMode;
  }

  goBack(): void {
    this.router.navigate(['/manage-games']);
  }
}
