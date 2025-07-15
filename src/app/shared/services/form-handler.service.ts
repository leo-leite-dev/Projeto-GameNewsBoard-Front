import { Injectable } from '@angular/core';
import { NotificationService } from './commons/notification.service';
import { ErrorHandlingService } from './commons/error-handling.service';
import { uploadedImageService } from './uploaded-image-service';

@Injectable({
  providedIn: 'root',
})
export class FormHandlerService {
  constructor(
    private notification: NotificationService,
    private errorHandler: ErrorHandlingService,
    private uploadedImageService: uploadedImageService
  ) {}

  handleFormResponse(form: any, response: any): void {
    form.patchValue(response);
  }

  handleError(isLoading: boolean, error: any, customMessage: string = ''): void {
    isLoading = false;
    const errorMessage = this.errorHandler.handleHttpError(error);
    this.notification.error(customMessage || errorMessage);
  }

  handleFileSelection(
    file: File,
    onSuccess: (res: any) => void,
    onError: (err: any) => void
  ): void {
    this.uploadedImageService.uploadImage(file).subscribe({
      next: (res) => {
        onSuccess(res);
      },
      error: (err) => {
        console.error('Erro ao enviar imagem:', err);
        onError(err);
      },
    });
  }
}
