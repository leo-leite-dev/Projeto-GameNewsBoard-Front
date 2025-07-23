import { Component, OnInit } from '@angular/core';
import { GameReleaseResponse } from '../../shared/models/game-release.model';
import { GameReleaseService } from '../../shared/services/game-release.service';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlatformFamily } from '../../shared/enums/platform.enum';
import { faGamepad, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faPlaystation, faSteam, faXbox } from '@fortawesome/free-brands-svg-icons';
import { PlatformFilterComponent } from '../../shared/components/platform-filter/platform-filter.component';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { GamerLoadingComponent } from '../../shared/components/gamer-loading/gamer-loading.component';
import { Router } from '@angular/router';

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
  errorMessage = '';
  message = '';
  selectedPlatform: PlatformFamily = PlatformFamily.All;

  public PlatformFamily = PlatformFamily;

  platforms = [
    { value: PlatformFamily.All, icon: faLayerGroup, label: 'Todos', key: 'todos' },
    { value: PlatformFamily.FamilyXbox, icon: faXbox, label: 'Xbox', key: 'xbox' },
    { value: PlatformFamily.FamilyPlaystation, icon: faPlaystation, label: 'PlayStation', key: 'playstation' },
    { value: PlatformFamily.FamilyMicrosoft, icon: faSteam, label: 'PCMicrosoftWindows', key: 'steam' },
    { value: PlatformFamily.FamilyNintendo, icon: faGamepad, label: 'Nintendo', key: 'nintendo' },
  ];

  constructor(
    private gameReleaseService: GameReleaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReleases(); // usa `this.selectedPlatform`
  }

  loadReleases(): void {
    this.isLoading = true;

    this.gameReleaseService.getTodayGames(this.selectedPlatform).subscribe({
      next: (res) => {
        this.todayGames = res.data ?? [];

        this.message = (!res.data || res.data.length === 0) ? res.message : '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar lançamentos do dia';
        this.todayGames = [];
        this.message = '';
      }
    });

    this.gameReleaseService.getUpcomingGames(7, this.selectedPlatform).subscribe({
      next: (res) => {
        this.upcomingGames = res.data ?? [];
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar lançamentos futuros';
        this.upcomingGames = [];
        this.isLoading = false;
      },
    });

    this.gameReleaseService.getRecentGames(7, this.selectedPlatform).subscribe({
      next: (res) => {
        this.recentGames = res.data ?? [];
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar lançamentos recentes';
        this.recentGames = [];
      },
    });
  }

  filterByPlatform(platform: PlatformFamily): void {
    this.selectedPlatform = platform;
    this.isLoading = true;
    this.errorMessage = '';

    this.gameReleaseService.getTodayGames(platform).subscribe({
      next: (res) => {
        this.todayGames = res.data ?? [];

        this.message = (!res.data || res.data.length === 0) ? res.message : '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao filtrar lançamentos do dia';
        this.todayGames = [];
        this.message = '';
      }
    });

    this.gameReleaseService.getUpcomingGames(7, platform).subscribe({
      next: (res) => {
        this.upcomingGames = res.data ?? [];
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao filtrar lançamentos futuros';
        this.upcomingGames = [];
        this.isLoading = false;
      }
    });

    this.gameReleaseService.getRecentGames(7, platform).subscribe({
      next: (res) => {
        this.recentGames = res.data ?? [];
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao filtrar lançamentos recentes';
        this.recentGames = [];
      }
    });
  }

  goToAllReleases(category: 'upcoming' | 'today' | 'recent'): void {
    this.router.navigate(['/all-releases'], {
      queryParams: {
        category,
        platform: this.selectedPlatform
      }
    });
  }
}
