import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ICategories } from '../../../models/categories/icategories';
import { ItemVideo } from '../../../models/content/youtube/item-video';
import { Page } from '../../../models/core/page';
import { HttpService } from '../http.service';
import { MetaMediaService } from '../meta-media.service';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService extends ContentService<ItemVideo> {
  private static BASE_URL = environment.apiUrl;
  private static CONTENT = '/content/';
  private static MEDIA_KEY = 'mediakey/';
  private static PAGE = 'page/';

  constructor(private http: HttpService, metaMediaService: MetaMediaService) {
    super(metaMediaService);
  }

  getContentById(id: number): Observable<ItemVideo> {
    const video = this.findLocalContentById(id);
    if (video != null) {
      return of(video);
    }

    return this.findServerContentById(id);
  }

  findServerContentById(id: number | string): Observable<ItemVideo> {
    const url = this.createUrl(id);
    return this.http.get(url).pipe(
      map((data: any) => {
        return new ItemVideo(data);
      })
    );
  }

  getContents(): Observable<Page<ItemVideo>> {
    this.page = new Page<ItemVideo>();
    this.page.next = 0;
    const url = this.createUrl();
    return this.http.get<Page<ItemVideo>>(url).pipe(
      map((page: Page<ItemVideo>) => {
        this.page = page;
        this.page.objects = this.page.objects.map(
          (itemVideo) => new ItemVideo(itemVideo)
        );
        return this.page;
      })
    );
  }

  loadMore(): Observable<Page<ItemVideo>> {
    const url = this.createUrl();
    return this.http.get<Page<ItemVideo>>(url).pipe(
      map((page: Page<ItemVideo>) => {
        this.page.objects = [...this.page.objects, ...page.objects];
        this.page.next = page.next;
        this.page.count = page.count;
        return this.page;
      })
    );
  }

  private createUrl(idPart?: number | string) {
    let url = YoutubeService.BASE_URL + YoutubeService.CONTENT;
    if (idPart) {
      // Si on cherche par id
      // ex: /content/11
      url += idPart;
    } else if (this.page && this.page.next !== undefined) {
      // Si on cherche par media key
      // ex: /content/mediakey/osonscauser/page/0
      url +=
        YoutubeService.MEDIA_KEY +
        this.metaMediaService.currentMetaMedia.key +
        '/';
      url += YoutubeService.PAGE + this.page.next;
    } else {
      // Si on cherche par media key
      // ex: /content/mediakey/osonscauser
      url +=
        YoutubeService.MEDIA_KEY + this.metaMediaService.currentMetaMedia.key;
    }
    return url;
  }

  getNotificationCategories(): Observable<ICategories[]> {
    return of([]);
  }
}
