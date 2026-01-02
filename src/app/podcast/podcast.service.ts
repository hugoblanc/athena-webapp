import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Podcast } from './models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private readonly baseUrl = `${environment.apiUrl}/podcast`;

  constructor(private readonly http: HttpClient) {}

  getPodcastById(id: string): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.baseUrl}/${id}`);
  }
}
