import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListMetaMedias } from '../models/meta-media/list-meta-medias';
import { MetaMedia } from '../models/meta-media/meta-media';
import { MetaMediaService } from '../core/services/meta-media.service';

/**
 * Page d'accueil affichant la liste des médias disponibles
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listMetaMedia: ListMetaMedias[] = [];
  loading = true;

  constructor(
    public metaMediaService: MetaMediaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.metaMediaService.listMetaMedia$
      .subscribe((listMetaMedia: ListMetaMedias[]) => {
        this.listMetaMedia = listMetaMedia;
        this.loading = false;
      });
  }

  navigateToMedia(metaMedia: MetaMedia): void {
    this.router.navigate(['/media', metaMedia.key]);
  }
}
