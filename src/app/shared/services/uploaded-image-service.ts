import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';

@Injectable({ providedIn: 'root' })
export class uploadedImageService {
  private readonly uploadedBaseUrl = `${environment.apiBaseUrl}/UploadedImage`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  uploadImage(image: File): Observable<{ imageUrl: string; imageId: string }> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http
      .post<ApiResponse<{ imageUrl: string; imageId: string }>>(
        `${this.uploadedBaseUrl}/upload`,
        formData
      )
      .pipe(
        map((res) => {
          if (!res || !res.success || !res.data || !res.data.imageUrl || !res.data.imageId)
            throw new Error('Resposta de upload inválida.');

          return res.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<ApiResponse<object>>(`${this.uploadedBaseUrl}/${imageId}`).pipe(
      map(() => {}), 
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }
}
