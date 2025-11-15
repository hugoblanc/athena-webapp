import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaMediaService } from '../../core/services/meta-media.service';
import { ContentService } from '../../core/services/content/content.service';
import { IContent } from '../../models/content/icontent';
import { MetaMedia } from '../../models/meta-media/meta-media';
import { Page } from '../../models/core/page';
import { Post } from '../../models/content/wordpress/post';
import { ItemVideo } from '../../models/content/youtube/item-video';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  currentMetaMedia!: MetaMedia;
  contents: IContent[] = [];
  loading = true;
  loadingMore = false;
  hasMore = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metaMediaService: MetaMediaService,
    private contentService: ContentService<IContent>
  ) {}

  ngOnInit(): void {
    // The guard already set the currentMetaMedia
    this.currentMetaMedia = this.metaMediaService.currentMetaMedia;
    this.loadContents();
  }

  loadContents(): void {
    this.loading = true;
    this.contentService.getContents().subscribe({
      next: (page: Page<IContent>) => {
        this.contents = page.objects;
        this.hasMore = page.next > 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contents:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore || !this.hasMore) {
      return;
    }

    this.loadingMore = true;
    this.contentService.loadMore().subscribe({
      next: (page: Page<IContent>) => {
        this.contents = [...this.contents, ...page.objects];
        this.hasMore = page.next > 0;
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error loading more contents:', error);
        this.loadingMore = false;
      }
    });
  }

  openContent(content: IContent): void {
    this.router.navigate(['/content', this.currentMetaMedia.key, content.contentId]);
  }

  getImageUrl(content: IContent): string | undefined {
    // For WordPress posts
    if (content instanceof Post && content.image) {
      return content.image.url;
    }
    // For YouTube videos
    if (content instanceof ItemVideo && content.image) {
      return content.image.url;
    }
    return undefined;
  }

  getTitle(content: IContent): string {
    return content.title || 'Sans titre';
  }

  getDate(content: IContent): Date | undefined {
    return content.publishedAt;
  }
}
