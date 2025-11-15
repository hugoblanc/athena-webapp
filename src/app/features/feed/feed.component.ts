import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MixedContent } from '../../models/content/mixed-content';
import { Page } from '../../models/core/page';
import { MixedContentService } from '../../core/services/content/mixed-content.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  contents: MixedContent[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 20;
  searchTerm = '';
  searchSubject = new Subject<string>();
  hasMore = true;

  constructor(
    private mixedContentService: MixedContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Setup search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.resetAndLoad();
    });

    // Initial load
    this.loadContents();
  }

  resetAndLoad(): void {
    this.currentPage = 0;
    this.contents = [];
    this.hasMore = true;
    this.loadContents();
  }

  loadContents(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.mixedContentService.getLastFeedContent(
      this.currentPage,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (page: Page<MixedContent>) => {
        this.contents = [...this.contents, ...page.objects];
        this.currentPage++;
        this.hasMore = page.objects.length === this.pageSize;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading feed:', error);
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  navigateToContent(content: MixedContent): void {
    this.router.navigate(['/content', content.metaMedia.key, content.contentId]);
  }

  trackByContentId(index: number, content: MixedContent): string | number {
    return content.id;
  }
}
