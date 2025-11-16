import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Récupère l'URL du fichier audio pour un contenu donné
   * @param contentId L'ID du contenu externe (WordPress ID)
   * @param mediaKey La clé du média (ex: "relevepeste")
   * @returns Observable contenant l'URL de l'audio ou null si pas d'audio
   */
  getAudioUrlByContentId(contentId: string | number, mediaKey: string): Observable<{ url: string } | null> {
    // D'abord récupérer l'ID interne à partir du contentId et mediaKey
    return this.http.get<{ id: number }>(`${this.apiUrl}/content/get-id-from-content-id-and-media-key/${mediaKey}/${contentId}`)
      .pipe(
        switchMap((content) => {
          // Ensuite récupérer l'audio avec l'ID interne
          return this.http.get<{ url: string } | null>(
            `${this.apiUrl}/content/get-audio-content-url-by-id/${content.id}`
          );
        }),
        catchError((error) => {
          console.log('Error fetching audio:', error);
          return of(null);
        })
      );
  }
}
