import { GameResponse } from '../models/game-response.model';
import { CarouselItem } from '../models/commons/carousel-item.model';

export function mapGameToCarouselItem(game: GameResponse): CarouselItem {
  return {
    id: game.id,
    title: game.title,
    coverImage: game.coverImage
  };
}
