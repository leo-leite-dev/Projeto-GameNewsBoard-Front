import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameReleaseResponse } from '../../shared/models/game-release.model';
import { PlatformFamily } from '../../shared/enums/platform.enum';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlatformFilterComponent } from '../../shared/components/platform-filter/platform-filter.component';
import { GamerLoadingComponent } from '../../shared/components/gamer-loading/gamer-loading.component';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { GameReleaseLoaderService } from '../../shared/services/commons/game-release-loader.service';
import { PLATFORM_FILTER_OPTIONS } from '../../shared/utils/platform-options';

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
    private loader: GameReleaseLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReleases();
  }

  loadReleases(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.loader.loadAllGrouped(this.selectedPlatform).subscribe({
      next: (res) => {
        this.todayGames = res.today;
        this.upcomingGames = res.upcoming;
        this.recentGames = res.recent;

        this.message = (!res.today.length) ? 'Nenhum jogo lançado hoje.' : '';
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: () => {
        this.todayGames = [];
        this.upcomingGames = [];
        this.recentGames = [];

        this.message = '';
        this.errorMessage = 'Erro ao carregar lançamentos.';
        this.isLoading = false;
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