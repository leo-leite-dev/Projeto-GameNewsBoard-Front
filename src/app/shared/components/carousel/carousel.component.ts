import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef, ContentChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GamerLoadingComponent } from '../gamer-loading/gamer-loading.component';
import { CarouselItem } from '../../models/commons/game-carousel-tem.model';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DragDropModule, GamerLoadingComponent],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() title: string = 'Carousel';
  @Input() games: CarouselItem[] = [];
  @Input() isLoading: boolean = false;
  @Input() enableDrag: boolean = false;
  @Input() connectedDropLists: string[] = [];

  @Output() dragStarted = new EventEmitter<CarouselItem>();

  @ViewChild('carouselContainer', { static: false })
  carouselContainerRef!: ElementRef<HTMLDivElement>;

  @ContentChild(TemplateRef) itemTemplate?: TemplateRef<any>;

  scrollInterval: any;
  isPaused = false;

  private autoScrollRetryInterval?: any;

  ngAfterViewInit(): void {
    this.tryStartAutoScroll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['games'] && !changes['games'].isFirstChange()) {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
      }

      this.tryStartAutoScroll();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollInterval)
      clearInterval(this.scrollInterval);

    if (this.autoScrollRetryInterval)
      clearInterval(this.autoScrollRetryInterval);
  }

  private tryStartAutoScroll(): void {
    this.autoScrollRetryInterval = setInterval(() => {
      const containerReady = !!this.carouselContainerRef?.nativeElement;
      const dataReady = !this.isLoading && this.games.length > 0;

      if (containerReady && dataReady) {
        this.startAutoScroll();
        clearInterval(this.autoScrollRetryInterval);
      }
    }, 100);
  }

  startAutoScroll(): void {
    const container = this.carouselContainerRef?.nativeElement;
    if (!container) return;

    if (this.scrollInterval)
      clearInterval(this.scrollInterval);

    this.scrollInterval = setInterval(() => {
      if (this.isPaused) return;

      container.scrollLeft += 1.5;

      if (container.scrollLeft >= container.scrollWidth / 2)
        container.scrollLeft = 0;
    }, 20);
  }

  toggleScroll(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused)
      this.startAutoScroll();
  }

  scrollLeft(): void {
    this.carouselContainerRef.nativeElement.scrollLeft -= 100;
  }

  scrollRight(): void {
    this.carouselContainerRef.nativeElement.scrollLeft += 100;
  }

  getFullCoverUrl(imageUrl: string): string {
    return imageUrl?.replace('t_thumb', 't_cover_big');
  }

  onDragStarted(game: CarouselItem): void {
    this.dragStarted.emit(game);
  }
}