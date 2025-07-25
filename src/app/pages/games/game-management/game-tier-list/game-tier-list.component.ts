import { Component, OnInit } from '@angular/core';
import { NavigateButtonComponent } from '../../../../shared/components/buttons/navigate-button/navigate-button.component';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { TierListService } from '../../../../shared/services/tier-list-service';
import { TierListResponse } from '../../../../shared/models/tier-list.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RemoveButtonComponent } from '../../../../shared/components/buttons/remove-button/remove-button.component';
import { ConfirmDialogComponent } from '../../../../shared/modais/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../shared/services/commons/notification.service';
import { GamerLoadingComponent } from '../../../../shared/components/gamer-loading/gamer-loading.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateButtonComponent } from '../../../../shared/components/buttons/create-button/create-button.component';

@Component({
  selector: 'app-game-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    CreateButtonComponent,
    RemoveButtonComponent,
    ConfirmDialogComponent,
    GamerLoadingComponent,
  ],
  templateUrl: './game-tier-list.component.html',
  styleUrl: './game-tier-list.component.scss',
})
export class GameTierListComponent implements OnInit {
  tierLists: TierListResponse[] = [];
  message: string | null = null;
  messageType: 'info' | 'error' = 'info';
  isLoading = false;
  isMobile = false;

  activeTierMenuId: string | null = null;
  confirmTierId: string | null = null;

  constructor(
    private tierListService: TierListService,
    private router: Router,
    private errorHandler: ErrorHandlingService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 600;
    this.loadTiers();
    this.mockTiers();
  }

  private mockTiers(): void {
    this.isLoading = false;
    this.tierLists = Array.from({ length: 30 }, (_, i): TierListResponse => ({
      id: `mock-${i + 1}`,
      title: `Tier ${i + 1}`,
      imageUrl: null, 
      entries: [], 
    }));
  }

  loadTiers(): void {
    this.isLoading = true;
    this.tierListService.getMyTierLists().subscribe({
      next: (tiers) => this.handleResponse(tiers),
      error: (err) => this.handleError(err),
    });
  }

  private handleResponse(tiers: TierListResponse[]): void {
    this.tierLists = tiers;
    this.isLoading = false;
    this.message = tiers.length === 0 ? 'Nenhuma tier encontrada.' : null;
    this.messageType = 'info';
  }

  private handleError(err: HttpErrorResponse): void {
    this.isLoading = false;
    this.message = this.errorHandler.handleHttpError(err);
    this.messageType = 'error';
    this.notification.error(this.message);
  }

  toggleTierMenu(tierId: string): void {
    this.activeTierMenuId = this.activeTierMenuId === tierId ? null : tierId;
  }

  openConfirmDialog(tierId: string): void {
    this.confirmTierId = tierId;
  }

  onDeleteConfirmed(): void {
    if (!this.confirmTierId)
      return;

    this.tierListService.deleteTierList(this.confirmTierId).subscribe({
      next: () => {
        this.tierLists = this.tierLists.filter((t) => t.id !== this.confirmTierId);
        this.confirmTierId = null;
        this.notification.success('Tier deletada com sucesso.');
      },
      error: (err) => {
        console.error('[onDeleteConfirmed] Erro ao deletar tier:', err);
        this.handleError(err);
        this.confirmTierId = null;
      },
    });
  }

  onDeleteCancelled(): void {
    this.confirmTierId = null;
  }

  getImageUrl(relativePath?: string | null): string {
    if (!relativePath)
      return 'assets/images/default-tier.png';

    return encodeURI(`${environment.uploadsBaseUrl}${relativePath}`);
  }

  goToTier(tierId: string): void {
    this.router.navigate(['manage-games/tier-list/add-game-tier-list', tierId]);
  }

  goToCreateTier(): void {
    this.router.navigate(['manage-games/tier-list/create-tier-list']);
  }

  goToEditTier(tierId: string): void {
    this.router.navigate(['manage-games/tier-list/edit-tier-list', tierId]);
  }
}
