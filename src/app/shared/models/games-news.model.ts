export interface GameNewsResponse {
  totalResults: number;
  articles: GameNewsArticle[];
}

export interface GameNewsArticle {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  pubDate: string;
}
