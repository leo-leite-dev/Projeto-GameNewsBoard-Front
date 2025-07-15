import { Component, OnInit } from '@angular/core';
import { GameReleaseResponse } from '../../shared/models/game-release.model';
import { GameReleaseService } from '../../shared/services/game-release.service';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlatformFamily } from '../../shared/enums/platform.enum';
import { faGamepad, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faPlaystation, faSteam, faXbox } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import { PlatformFilterComponent } from '../../shared/components/platform-filter/platform-filter.component';

@Component({
  selector: 'app-game-releases',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    FontAwesomeModule,
    PlatformFilterComponent
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

  public PlatformFamily = PlatformFamily;

  selectedPlatform: PlatformFamily | null = null;

  platforms = [
    { value: null, icon: faLayerGroup, label: 'Todos', key: 'todos' },
    { value: PlatformFamily.FamilyXbox, icon: faXbox, label: 'Xbox', key: 'xbox' },
    { value: PlatformFamily.FamilyPlaystation, icon: faPlaystation, label: 'PlayStation', key: 'playstation' },
    { value: PlatformFamily.FamilyMicrosoft, icon: faSteam, label: 'PCMicrosoftWindows', key: 'steam' },
    { value: PlatformFamily.FamilyNintendo, icon: faGamepad, label: 'Nintendo', key: 'nintendo' },
  ];

  constructor(private gameReleaseService: GameReleaseService) { }

  ngOnInit(): void {
    this.loadReleases();
  }

  loadReleases(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameReleaseService.getTodayGames().subscribe({
      next: (games) => {
        this.todayGames = games;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar lançamentos do dia';
      }
    });

    this.gameReleaseService.getUpcomingGames(7).subscribe({
      next: (games) => {
        this.upcomingGames = games;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar lançamentos futuros';
        this.isLoading = false;
      },
    });

    this.gameReleaseService.getRecentGames(7).subscribe({
      next: (games) => (this.recentGames = games),
      error: () => (this.errorMessage = 'Erro ao carregar lançamentos recentes'),
    });
  }

  filterByPlatform(platform: PlatformFamily | null): void {
    this.selectedPlatform = platform;
    this.isLoading = true;
    this.errorMessage = '';

    this.gameReleaseService.getUpcomingGames(7, platform ?? undefined).subscribe({
      next: (games) => {
        this.upcomingGames = games;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao filtrar lançamentos futuros';
        this.isLoading = false;
      },
    });

    this.gameReleaseService.getRecentGames(7, platform ?? undefined).subscribe({
      next: (games) => (this.recentGames = games),
      error: () => (this.errorMessage = 'Erro ao filtrar lançamentos recentes'),
    });
  }

}
