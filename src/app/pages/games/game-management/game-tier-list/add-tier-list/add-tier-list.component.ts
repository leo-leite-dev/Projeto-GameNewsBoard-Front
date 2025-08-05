import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { UploadedImageService } from '../../../../../shared/services/uploaded-image-service';
import { NotificationService } from '../../../../../shared/services/commons/notification.service';
import { TierListRequest, TierListResponse } from '../../../../../shared/models/tier-list.model';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { InputComponent } from '../../../../../shared/forms/input/input.component';
import { SubmitButtonComponent } from '../../../../../shared/components/buttons/submit-button/submit-button.component';
import { NavigateButtonComponent } from '../../../../../shared/components/buttons/navigate-button/navigate-button.component';
import { ViewportService } from '../../../../../shared/services/commons/viewport.service';

@Component({
  selector: 'app-add-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    ReactiveFormsModule,
    InputComponent,
    SubmitButtonComponent,
    NavigateButtonComponent,
  ],
  templateUrl: './add-tier-list.component.html',
  styleUrl: './add-tier-list.component.scss'
})
export class AddTierListComponent implements OnInit {
  @Input() tierId: string | null = null;

  @Output() formSubmitted = new EventEmitter<void>();

  form: FormGroup;
  previewUrl: string | null = null;
  imageId: string | null = null;
  imageUrl: string | null = null;
  uploading = false;
  isEditMode = false;
  isMobile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tierListService: TierListService,
    private router: Router,
    private uploadedImageService: UploadedImageService,
    private notification: NotificationService,
    private viewport: ViewportService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const target = event.target as Window;
    this.isMobile = target.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.tierId = this.route.snapshot.paramMap.get('tierId');

    this.isMobile = this.viewport.isMobile();

    if (this.tierId) {
      this.isEditMode = true;
      this.loadTier();
    }
  }

  loadTier(): void {
    if (!this.tierId) return;

    this.tierListService.getTierById(this.tierId).subscribe({
      next: ({ title, imageUrl, imageId }: TierListResponse) => {
        this.form.patchValue({ title });

        if (imageUrl) {
          this.previewUrl = imageUrl;
          this.imageId = imageId ?? null;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar tier:', err);
        this.notification.error('Erro ao carregar dados da tier.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.uploading = true;

    this.uploadedImageService.uploadImage(file).subscribe({
      next: ({ imageUrl, imageId }) => {
        this.previewUrl = imageUrl;
        this.imageUrl = imageUrl;
        this.imageId = imageId;
        this.uploading = false;
      },
      error: (err) => {
        console.error('Erro ao enviar imagem:', err);
        this.notification.error('Erro ao enviar imagem. Tente novamente.');

        this.previewUrl = null;
        this.imageUrl = null;
        this.imageId = null;
        this.uploading = false;
      },
    });
  }

  submit(): void {
    const payload: TierListRequest = {
      title: this.form.value.title?.trim() || 'Sem Título',
      imageUrl: this.previewUrl,
      imageId: this.imageId,
    };

    if (this.isEditMode && this.tierId) {
      this.tierListService.updateTierList(this.tierId, payload).subscribe({
        next: (res) => {
          this.notification.success(res.message);
          this.formSubmitted.emit();
          this.router.navigate(['/manage-games']);
        },
        error: (err) =>
          this.notification.error('Erro ao atualizar tier: ' + err.message),
      });
    } else {
      this.createTier(payload);
    }
  }

  private createTier(payload: TierListRequest): void {
    this.tierListService.createTierList(payload).subscribe({
      next: (res) => {
        this.notification.success(res.message);
        this.formSubmitted.emit();
        this.router.navigate(['/manage-games']);
      },
      error: (err) => this.notification.error('Erro ao criar tier: ' + err.message),
    });
  }

  getRedirectRoute(): string {
    return '/manage-games/tier-list';
  }

  goBack(): void {
    this.router.navigate(['/manage-games']);
  }
}