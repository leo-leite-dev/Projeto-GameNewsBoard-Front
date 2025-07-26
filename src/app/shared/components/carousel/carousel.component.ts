import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef, ContentChild, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GamerLoadingComponent } from '../gamer-loading/gamer-loading.component';
import { CarouselItem } from '../../models/commons/game-carousel-tem.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ViewportService } from '../../services/commons/viewport.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    GenericModule,
    FontAwesomeModule,
    DragDropModule,
    GamerLoadingComponent
  ],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() title: string = 'Carousel';
  @Input() games: CarouselItem[] = [];
  @Input() isLoading: boolean = false;
  @Input() enableDrag: boolean = false;
  @Input() connectedDropLists: string[] = [];
  @Input() autoReverse: boolean = false;
  @Input() itemTemplate?: TemplateRef<any>;
  @Input() category!: 'today' | 'upcoming' | 'recent';

  @Output() dragStarted = new EventEmitter<CarouselItem>();
  @Output() seeAllClicked = new EventEmitter<void>();

  @ViewChild('carouselContainer', { static: false })

  carouselContainerRef!: ElementRef<HTMLDivElement>;
  isPaused = false;
  canScroll: boolean = false;

  private scrollInterval: any;
  private direction: 'forward' | 'backward' = 'forward';
  private autoScrollRetryInterval?: any;

  constructor(private viewport: ViewportService) { }

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
        const container = this.carouselContainerRef.nativeElement;
        this.canScroll = container.scrollWidth > container.clientWidth;

        if (this.canScroll && !this.viewport.isMobile()) {
          this.isPaused = false;
          this.startAutoScroll();
        } else {
          this.isPaused = true;
        }

        clearInterval(this.autoScrollRetryInterval);
      }
    }, 100);
  }

  startAutoScroll(): void {
    const container = this.carouselContainerRef?.nativeElement;
    if (!container) return;

    if (this.scrollInterval) clearInterval(this.scrollInterval);

    this.scrollInterval = setInterval(() => {
      if (this.isPaused) return;

      const scrollAmount = this.direction === 'forward' ? 1.5 : -1.5;
      container.scrollLeft += scrollAmount;

      if (this.autoReverse) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll) this.direction = 'backward';
        if (container.scrollLeft <= 0) this.direction = 'forward';
      } else {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll) container.scrollLeft = 0;
      }
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

  onSeeAllClick(event: MouseEvent): void {
    event.preventDefault();
    console.log('[Carousel] Ver tudo clicado - categoria:', this.category);
    this.seeAllClicked.emit();
  }
}