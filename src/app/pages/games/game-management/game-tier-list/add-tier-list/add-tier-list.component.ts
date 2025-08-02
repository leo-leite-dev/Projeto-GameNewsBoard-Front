import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { uploadedImageService } from '../../../../../shared/services/uploaded-image-service';
import { NotificationService } from '../../../../../shared/services/commons/notification.service';
import { TierListRequest, TierListResponse, UpdateTierListRequest } from '../../../../../shared/models/tier-list.model';
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
    private uploadedImageService: uploadedImageService,
    private notification: NotificationService,
    private viewport: ViewportService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 600;
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
    if (this.tierId) {
      this.tierListService.getTierById(this.tierId).subscribe({
        next: (tier: TierListResponse) => {
          this.form.patchValue({ title: tier.title });

          if (tier.imageUrl) {
            this.previewUrl = tier.imageUrl;
            this.imageId = tier.imageId || null;
          }
        },
        error: () => this.notification.error('Erro ao carregar dados da tier.'),
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.uploading = true;

    this.uploadedImageService.uploadImage(file).subscribe({
      next: (res) => {
        this.previewUrl = res.imageUrl;
        this.imageId = res.imageId;
        this.imageUrl = res.imageUrl;
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
    if (!this.imageId) {
      this.notification.error('Imagem não foi carregada corretamente. Tente novamente.');
      return;
    }

    if (this.form.invalid || this.uploading) {
      this.notification.error('Por favor, preencha todos os campos antes de enviar.');
      return;
    }

    let title = this.form.value.title;

    if (!this.isEditMode && !title) {
      this.notification.error('Título é obrigatório ao criar uma tier.');
      return;
    }

    if (this.isEditMode && !title)
      title = 'Sem Título';

    const payload: UpdateTierListRequest = {
      title: title || 'Sem Título',
      imageUrl: this.previewUrl,
      imageId: this.imageId,
    };

    if (this.isEditMode) {
      this.tierListService.updateTierList(this.tierId!, payload).subscribe({
        next: () => {
          this.notification.success('Tier atualizada com sucesso!');
          this.formSubmitted.emit();
          this.router.navigate(['/manage-games']);
        },
        error: (err) => this.notification.error('Erro ao atualizar tier: ' + err.message),
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