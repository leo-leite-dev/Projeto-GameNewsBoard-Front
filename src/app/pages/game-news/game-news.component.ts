import { Component, OnInit } from '@angular/core';
import { GameNewsArticle } from '../../shared/models/games-news.model';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { GameNewsFeaturedComponent } from './game-news-featured/game-news-featured.component';
import { GameNewsListComponent } from './game-news-list/game-news-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXbox, faPlaystation, faSteam } from '@fortawesome/free-brands-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { GameNewsService } from '../../shared/services/game-news.service';
import { NotificationService } from '../../shared/services/commons/notification.service';
import { PlatformFilterComponent } from '../../shared/components/platform-filter/platform-filter.component';
import { GamerLoadingComponent } from '../../shared/components/gamer-loading/gamer-loading.component';

@Component({
  selector: 'app-game-news',
  standalone: true,
  imports: [
    GenericModule,
    GameNewsListComponent,
    FontAwesomeModule,
    GameNewsFeaturedComponent,
    PlatformFilterComponent,
    GamerLoadingComponent
  ],
  templateUrl: './game-news.component.html',
  styleUrls: ['./game-news.component.scss'],
})
export class GameNewsComponent implements OnInit {
  news: GameNewsArticle[] = [];
  isLoading = false;

  platforms = [
    { value: 'xbox', icon: faXbox, key: 'xbox' },
    { value: 'ps5', icon: faPlaystation, key: 'playstation' },
    { value: 'pc', icon: faSteam, key: 'steam' },
    { value: 'nintendo', icon: faGamepad, key: 'nintendo' },
  ];

  selectedPlatform = 'xbox';

  constructor(
    private gamesNewsService: GameNewsService,
    private notification: NotificationService
  ) { }

  get slicedNews(): GameNewsArticle[] {
    return this.news?.slice(1) ?? [];
  }

  ngOnInit(): void {
    this.loadGameNews(this.selectedPlatform);
  }

  loadGameNews(platform: string): void {
    this.selectedPlatform = platform;
    this.isLoading = true;

    this.gamesNewsService.getNewsByPlatform(platform).subscribe({
      next: (res) => this.handleResponse(res),
      error: (err) => this.handleError(err),
    });
  }

  private handleResponse(response: any): void {
    this.isLoading = false;
    if (response.success) {
      this.news = response.data.articles;
    } else {
      console.error('Erro ao carregar notícias:', response.message);
      this.notification.error(response.message || 'Erro ao carregar notícias');
    }
  }

  private handleError(error: any): void {
    this.isLoading = false;
    const errorMessage = error?.message || 'Erro ao buscar notícias.';
    console.error(errorMessage, error);
    this.notification.error(errorMessage);
  }
}
