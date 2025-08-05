import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { UploadedImageResponse } from '../models/uploaded-image.model';
import { validateApiResponse } from '../utils/api-response-util';

@Injectable({ providedIn: 'root' })
export class UploadedImageService {
  private readonly baseUrl = `${environment.apiBaseUrl}/UploadedImage`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  uploadImage(image: File): Observable<UploadedImageResponse> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http
      .post<ApiResponse<UploadedImageResponse>>(`${this.baseUrl}/upload`, formData)
      .pipe(
        map((response) => {
          const validated = validateApiResponse(response, 'fazer upload da imagem');
          if (!validated.data) throw new Error('Upload retornou resposta inválida.');
          return validated.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  deleteImage(imageId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${imageId}`)
      .pipe(
        map((response) => {
          validateApiResponse(response, 'deletar a imagem');
          return;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}
