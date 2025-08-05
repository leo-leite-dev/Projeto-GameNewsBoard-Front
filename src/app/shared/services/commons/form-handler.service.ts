import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { ErrorHandlingService } from './error-handling.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormHandlerService {
  constructor(
    private notification: NotificationService,
    private errorHandler: ErrorHandlingService,
  ) { }

  handleFormResponse<T extends { patchValue(value: Partial<T>): void }>(
    form: T,
    response: Partial<T>
  ): void {
    form.patchValue(response);
  }

  handleError(
    isLoading: boolean,
    error: unknown,
    customMessage: string = ''
  ): void {
    isLoading = false;

    const parsedMessage =
      error instanceof HttpErrorResponse
        ? this.errorHandler.handleHttpError(error)
        : 'Erro inesperado ao processar a requisição.';

    this.notification.error(customMessage || parsedMessage);
  }
}