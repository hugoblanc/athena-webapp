import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Podcast } from './models/podcast.model';

export interface PodcastListResponse {
  data: Podcast[];
  total: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private readonly baseUrl = `${environment.apiUrl}/podcast`;

  constructor(private readonly http: HttpClient) {}

  getPodcastById(id: string): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.baseUrl}/${id}`);
  }

  getPodcastList(page: number, size: number, searchTerms?: string): Observable<PodcastListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerms && searchTerms.trim()) {
      params = params.set('terms', searchTerms.trim());
    }

    return this.http.get<PodcastListResponse>(`${this.baseUrl}/list`, { params });
  }

  getNextPodcast(currentPodcastId: number): Observable<Podcast | null> {
    // Récupère le podcast suivant (plus récent que l'actuel)
    return this.http.get<Podcast | null>(`${this.baseUrl}/${currentPodcastId}/next`);
  }
}
