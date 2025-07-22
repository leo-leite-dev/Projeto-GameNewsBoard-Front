import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameReleaseResponse } from '../../../shared/models/game-release.model';
import { GameReleaseService } from '../../../shared/services/game-release.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PlatformFilterComponent } from '../../../shared/components/platform-filter/platform-filter.component';
import { PlatformFamily } from '../../../shared/enums/platform.enum';
import { faGamepad, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faPlaystation, faSteam, faXbox } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-all-releases',
  standalone: true,
  imports: [
    GenericModule,
    GamerLoadingComponent,
    PlatformFilterComponent
  ],
  templateUrl: './all-releases.component.html',
  styleUrl: './all-releases.component.scss',
})
export class AllReleasesComponent implements OnInit {
  games: GameReleaseResponse[] = [];
  isLoading = true;
  message = '';
  category: 'recent' | 'upcoming' | 'today' = 'upcoming';
  selectedPlatform: PlatformFamily = PlatformFamily.All;

  platforms = [
    { value: PlatformFamily.All, icon: faLayerGroup, label: 'Todos', key: 'todos' },
    { value: PlatformFamily.FamilyXbox, icon: faXbox, label: 'Xbox', key: 'xbox' },
    { value: PlatformFamily.FamilyPlaystation, icon: faPlaystation, label: 'PlayStation', key: 'playstation' },
    { value: PlatformFamily.FamilyMicrosoft, icon: faSteam, label: 'PCMicrosoftWindows', key: 'steam' },
    { value: PlatformFamily.FamilyNintendo, icon: faGamepad, label: 'Nintendo', key: 'nintendo' },
  ];

  categories = [
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
      this.category = params['category'] || 'upcoming';
      const platformParam = +params['platform'];
      this.selectedPlatform = isNaN(platformParam) ? PlatformFamily.All : platformParam;

      this.loadGames();
    });
  }

  loadGames(): void {
    this.isLoading = true;
    this.message = '';
    this.games = [];

    let fetchGames$;

    switch (this.category) {
      case 'recent':
        fetchGames$ = this.gameReleaseService.getRecentGames(14, this.selectedPlatform);
        break;
      case 'today':
        fetchGames$ = this.gameReleaseService.getTodayGames(this.selectedPlatform);
        break;
      default:
        fetchGames$ = this.gameReleaseService.getUpcomingGames(30, this.selectedPlatform);
        break;
    }

    fetchGames$.subscribe({
      next: (res) => {
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

  onCategoryChange(category: string): void {
    if (category !== 'recent' && category !== 'today' && category !== 'upcoming') return;

    this.category = category;

    this.router.navigate([], {
      queryParams: {
        category: this.category,
        platform: this.selectedPlatform
      },
      queryParamsHandling: 'merge'
    });

    this.loadGames();
  }

  onPlatformChange(platform: PlatformFamily): void {
    this.selectedPlatform = platform;

    this.router.navigate([], {
      queryParams: {
        category: this.category,
        platform: platform
      },
      queryParamsHandling: 'merge'
    });

    this.loadGames();
  }
}
