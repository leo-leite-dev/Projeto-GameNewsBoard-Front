import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameReleaseResponse } from '../../shared/models/game-release.model';
import { PlatformFamily } from '../../shared/enums/platform.enum';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlatformFilterComponent } from '../../shared/components/platform-filter/platform-filter.component';
import { GamerLoadingComponent } from '../../shared/components/gamer-loading/gamer-loading.component';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { PLATFORM_FILTER_OPTIONS } from '../../shared/utils/platform-options';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { finalize } from 'rxjs';
import { GameReleaseService } from '../../shared/services/game-release.service';

@Component({
  selector: 'app-game-releases',
  standalone: true,
  imports: [
    GenericModule,
    CarouselComponent,
    FontAwesomeModule,
    PlatformFilterComponent,
    GamerLoadingComponent
  ],
  templateUrl: './game-releases.component.html',
  styleUrls: ['./game-releases.component.scss'],
})
export class GameReleasesComponent implements OnInit {
  todayGames: GameReleaseResponse[] = [];
  upcomingGames: GameReleaseResponse[] = [];
  recentGames: GameReleaseResponse[] = [];

  isLoading = false;
  isMobile = false;
  message = '';
  errorMessage = '';
  selectedPlatform: PlatformFamily = PlatformFamily.All;

  public PlatformFamily = PlatformFamily;

  platforms = PLATFORM_FILTER_OPTIONS;

  constructor(
    private gameReleaseService: GameReleaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReleases();
  }

  loadReleases(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.message = '';

    this.gameReleaseService.loadGroupedReleases(this.selectedPlatform)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          console.log('[Game Releases Response]', res);
          this.todayGames = res.today.data ?? [];
          this.upcomingGames = res.upcoming.data ?? [];
          this.recentGames = res.recent.data ?? [];

          this.message = res.today.message;
        },
        error: () => {
          this.todayGames = [];
          this.upcomingGames = [];
          this.recentGames = [];

          this.errorMessage = 'Erro ao carregar lançamentos.';
        },
      });
  }

  getCoverImage(game: GameReleaseResponse): string {
    return game.coverImage || 'assets/img/no-image.png';
  }

  filterByPlatform(platform: PlatformFamily): void {
    this.selectedPlatform = platform;
    this.loadReleases();
  }

  goToAllReleases(category: 'upcoming' | 'today' | 'recent'): void {
    this.router.navigate(['/all-releases'], {
      queryParams: {
        category,
        platform: this.selectedPlatform
      }
    });
  }

  onCardClick(gameId: number): void {
    this.goToComingSoon(gameId);
  }

  goToComingSoon(gameId: number): void {
    this.router.navigate(['/coming-soon'], { queryParams: { id: gameId } });
  }
}