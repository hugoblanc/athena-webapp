import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { QaHistoryItem, QaSource } from '../../../models/qa.model';
import { environment } from '../../../../environments/environment';

export interface AskQuestionResponse {
  jobId: string;
  status: string;
  createdAt: string;
}

export interface StreamEvent {
  type: 'token' | 'done' | 'error';
  content?: string;
  sources?: QaSource[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private readonly BASE_URL = `${environment.apiUrl}/qa`;

  constructor(private http: HttpService) { }

  /**
   * Ask a question and get a jobId
   */
  askQuestion(question: string): Observable<AskQuestionResponse> {
    return this.http.post<AskQuestionResponse>(
      `${this.BASE_URL}/ask`,
      { question }
    );
  }

  /**
   * Stream the answer as it's being generated using SSE
   * Returns an Observable that emits StreamEvent objects
   */
  streamAnswer(jobId: string): Observable<StreamEvent> {
    return new Observable(observer => {
      const eventSource = new EventSource(
        `${this.BASE_URL}/stream/${jobId}`
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);

          // Si c'est un événement 'done', fermer la connexion
          if (data.type === 'done') {
            observer.complete();
            eventSource.close();
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        observer.error(error);
        eventSource.close();
      };

      // Cleanup on unsubscribe
      return () => {
        eventSource.close();
      };
    });
  }

  /**
   * Get the full result for a job (with sources)
   */
  getResult(jobId: string): Observable<QaHistoryItem> {
    return this.http.get<QaHistoryItem>(`${this.BASE_URL}/result/${jobId}`);
  }

  /**
   * Get question/answer history from the backend
   */
  getHistory(page: number = 1, limit: number = 20): Observable<{ items: QaHistoryItem[], total: number, page: number, limit: number }> {
    return this.http.get<{ items: QaHistoryItem[], total: number, page: number, limit: number }>(
      `${this.BASE_URL}/history?page=${page}&limit=${limit}`
    );
  }

  /**
   * Delete a history item
   */
  deleteHistoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/history/${id}`);
  }
}
