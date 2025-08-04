import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ViewportService } from '../../services/commons/viewport.service';
import { FaIconComponent } from '../icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    GenericModule,
    DragDropModule,
    FaIconComponent
  ],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent<T> implements AfterViewInit, OnDestroy, OnChanges {
  @Input() title: string = 'Carousel';
  @Input() items: T[] = [];
  @Input() isLoading: boolean = false;
  @Input() enableDrag: boolean = false;
  @Input() connectedDropLists: string[] = [];
  @Input() autoReverse: boolean = false;
  @Input() itemTemplate?: TemplateRef<T>;
  @Input() category!: 'today' | 'upcoming' | 'recent';
  @Input() showSeeAll: boolean = true;
  @Input() showSearchIcon: boolean = false;

  @Output() dragStarted = new EventEmitter<T>();
  @Output() seeAllClicked = new EventEmitter<void>();
  @Output() itemClicked = new EventEmitter<T>();
  @Output() onSearchIconClicked = new EventEmitter<void>();

  @ViewChild('carouselContainer', { static: false })
  carouselContainerRef!: ElementRef<HTMLDivElement>;

  isPaused = false;
  isMobile = false;
  canScroll: boolean = false;

  private scrollInterval: any;
  private direction: 'forward' | 'backward' = 'forward';
  private autoScrollRetryInterval?: any;

  constructor(private viewport: ViewportService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isMobile = this.viewport.isMobile();
      this.tryStartAutoScroll();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].isFirstChange()) {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
      }
      this.tryStartAutoScroll();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.scrollInterval);
    clearInterval(this.autoScrollRetryInterval);
  }

  private tryStartAutoScroll(): void {
    this.autoScrollRetryInterval = setInterval(() => {
      const containerReady = !!this.carouselContainerRef?.nativeElement;
      const dataReady = !this.isLoading && this.items.length > 0;

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

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (this.autoReverse) {
        if (container.scrollLeft >= maxScroll) this.direction = 'backward';
        if (container.scrollLeft <= 0) this.direction = 'forward';
      } else {
        if (container.scrollLeft >= maxScroll) container.scrollLeft = 0;
      }
    }, 20);
  }

  toggleScroll(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) this.startAutoScroll();
  }

  scrollLeft(): void {
    this.carouselContainerRef.nativeElement.scrollLeft -= 100;
  }

  scrollRight(): void {
    this.carouselContainerRef.nativeElement.scrollLeft += 100;
  }

  onDragStarted(item: T): void {
    this.dragStarted.emit(item);
  }

  onItemClick(item: T): void {
    this.itemClicked.emit(item);
  }

  onSeeAllClick(event: MouseEvent): void {
    event.preventDefault();
    this.seeAllClicked.emit();
  }

  getFullCoverUrl(imageUrl: string): string {
    return imageUrl?.replace('t_thumb', 't_cover_big') ?? '';
  }
}