import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Podcast } from '../../podcast/models/podcast.model';
import { PodcastService, PodcastListResponse } from '../../podcast/podcast.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  podcasts: Podcast[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 20;
  searchTerm = '';
  searchSubject = new Subject<string>();
  hasMore = true;

  constructor(
    private podcastService: PodcastService,
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
    this.loadPodcasts();
  }

  resetAndLoad(): void {
    this.currentPage = 0;
    this.podcasts = [];
    this.hasMore = true;
    this.loadPodcasts();
  }

  loadPodcasts(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.podcastService.getPodcastList(
      this.currentPage + 1,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (response: PodcastListResponse) => {
        this.podcasts = [...this.podcasts, ...response.data];
        this.currentPage++;
        this.hasMore = response.data.length === this.pageSize;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading podcasts:', error);
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  navigateToPodcast(podcast: Podcast): void {
    this.router.navigate(['/podcast', podcast.id]);
  }

  trackByPodcastId(index: number, podcast: Podcast): number {
    return podcast.id;
  }

  getPodcastImage(podcast: Podcast): string {
    // Priorité : image de l'article, sinon logo du média
    return podcast.content.image?.url || podcast.content.meta_media.logo;
  }
}
