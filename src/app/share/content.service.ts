import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ShareableContentResponse } from './shareable-content.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  static BASE_URL = `${environment.apiUrl}/content`

  constructor(private readonly http: HttpClient) { }

  getSharedContent(id: number): Observable<ShareableContentResponse> {
    return this.http.get<ShareableContentResponse>(ContentService.BASE_URL + '/get-shareable-content/' + id)
  }
}

