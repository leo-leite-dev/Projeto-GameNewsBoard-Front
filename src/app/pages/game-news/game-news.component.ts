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

  get hasNews(): boolean {
    return Array.isArray(this.news) && this.news.length > 0;
  }

  get firstNews(): GameNewsArticle | null {
    return this.hasNews ? this.news[0] : null;
  }

  get slicedNews(): GameNewsArticle[] {
    return this.hasNews ? this.news.slice(1) : [];
  }

  ngOnInit(): void {
    this.loadGameNews(this.selectedPlatform);
//  this.selectedPlatform = 'xbox';
//     this.isLoading = true;

//     setTimeout(() => {
//       const mockNews: GameNewsArticle[] = [
//         {
//           title: 'Novo exclusivo do Xbox impressiona em prévia',
//           description: 'Imagens e gameplay do novo título surpreendem fãs.',
//           link: 'https://example.com/noticia-xbox',
//           imageUrl: 'https://via.placeholder.com/600x300?text=Notícia+Xbox',
//           pubDate: new Date().toISOString(),
//         },
//         {
//           title: 'PlayStation anuncia State of Play para agosto',
//           description: 'Evento trará novidades sobre God of War e mais.',
//           link: 'https://example.com/noticia-ps5',
//           imageUrl: 'https://via.placeholder.com/600x300?text=Notícia+PS5',
//           pubDate: new Date().toISOString(),
//         },
//       ];

//       const mockResponse = {
//         success: true,
//         data: {
//           totalResults: mockNews.length,
//           articles: mockNews,
//         },
//       };

//       this.handleResponse(mockResponse);
//     }, 1500); // Simula delay de carregamento
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
