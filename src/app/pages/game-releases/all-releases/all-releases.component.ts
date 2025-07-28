import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameReleaseResponse } from '../../../shared/models/game-release.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PlatformFilterComponent } from '../../../shared/components/platform-filter/platform-filter.component';
import { PlatformFamily } from '../../../shared/enums/platform.enum';
import { PLATFORM_FILTER_OPTIONS } from '../../../shared/utils/platform-options';
import { GameReleaseService } from '../../../shared/services/game-release.service';
import { ApiResponse } from '../../../shared/models/commons/api-response.model';

@Component({
  selector: 'app-all-releases',
  standalone: true,
  imports: [GenericModule, GamerLoadingComponent, PlatformFilterComponent],
  templateUrl: './all-releases.component.html',
  styleUrl: './all-releases.component.scss',
})
export class AllReleasesComponent implements OnInit {
  games: GameReleaseResponse[] = [];
  isLoading = true;
  message = '';
  category: 'recent' | 'upcoming' | 'today' = 'upcoming';
  selectedPlatform: PlatformFamily = PlatformFamily.All;

  platforms = PLATFORM_FILTER_OPTIONS;

  categories: { value: 'upcoming' | 'today' | 'recent'; label: string }[] = [
    { value: 'upcoming', label: 'Futuros' },
    { value: 'today', label: 'Hoje' },
    { value: 'recent', label: 'Recentes' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameReleaseService: GameReleaseService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.category = (params['category'] as 'recent' | 'upcoming' | 'today') || 'upcoming';
      const platformParam = +params['platform'];
      this.selectedPlatform = isNaN(platformParam) ? PlatformFamily.All : platformParam;
      this.loadGames();
    });
  }

  loadGames(): void {
    this.isLoading = true;
    this.message = '';
    this.games = [];

    this.gameReleaseService
      .loadAllByCategory(this.category, this.selectedPlatform)
      .subscribe({
        next: (res) => {
          console.log('🔍 Dados recebidos do loadAllByCategory:', res);
          this.games = res.data ?? [];
          this.message = res.message;
          this.isLoading = false;
        },
        error: () => {
          this.games = [];
          this.message = 'Erro ao carregar os jogos.';
          this.isLoading = false;
        },
      });
  }

  getCoverImage(game: GameReleaseResponse): string {
    return game.coverImage || 'assets/img/no-image.png';
  }

  onCategoryChange(category: 'recent' | 'today' | 'upcoming'): void {
    this.category = category;
    this.router.navigate([], {
      queryParams: {
        category,
        platform: this.selectedPlatform,
      },
      queryParamsHandling: 'merge',
    });
    this.loadGames();
  }

  onPlatformChange(platform: PlatformFamily): void {
    this.selectedPlatform = platform;
    this.router.navigate([], {
      queryParams: {
        category: this.category,
        platform,
      },
      queryParamsHandling: 'merge',
    });
    this.loadGames();
  }

  onCardClick(gameId: number): void {
    this.goToComingSoon(gameId);
  }

  goToComingSoon(gameId: number): void {
    this.router.navigate(['/coming-soon'], { queryParams: { id: gameId } });
  }
}