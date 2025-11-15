import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Récupère l'URL du fichier audio pour un contenu donné
   * @param contentId L'ID du contenu
   * @returns Observable contenant l'URL de l'audio ou null si pas d'audio
   */
  getAudioUrlByContentId(contentId: string | number): Observable<{ url: string } | null> {
    return this.http.get<{ url: string } | null>(
      `${this.apiUrl}/content/get-audio-content-url-by-id/${contentId}`
    );
  }
}
