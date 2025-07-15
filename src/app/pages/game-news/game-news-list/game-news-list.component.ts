import { Component, Input } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GameNewsArticle } from '../../../shared/models/games-news.model';

@Component({
  selector: 'app-game-news-list',
  imports: [GenericModule],
  templateUrl: './game-news-list.component.html',
  styleUrl: './game-news-list.component.scss',
})
export class GameNewsListComponent {
  @Input() news: GameNewsArticle[] = [];
}
