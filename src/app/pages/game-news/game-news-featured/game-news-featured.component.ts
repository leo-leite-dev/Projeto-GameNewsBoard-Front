import { Component, Input } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GameNewsArticle } from '../../../shared/models/games-news.model';

@Component({
  selector: 'app-game-news-featured',
  imports: [GenericModule],
  templateUrl: './game-news-featured.component.html',
  styleUrl: './game-news-featured.component.scss'
})
export class GameNewsFeaturedComponent {
  @Input() news!: GameNewsArticle;
}
