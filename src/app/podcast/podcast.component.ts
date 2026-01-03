import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PodcastService } from './podcast.service';
import { Podcast } from './models/podcast.model';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  podcast: Podcast | null = null;
  nextPodcast: Podcast | null = null;
  previousPodcast: Podcast | null = null;

  // État du lecteur
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  private audioElement: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private podcastService: PodcastService
  ) {}

  ngOnInit(): void {
    const podcastId = this.route.snapshot.paramMap.get('id');
    if (podcastId) {
      this.loadPodcast(podcastId);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private loadPodcast(id: string): void {
    this.isLoading = true;
    this.podcastService.getPodcastById(id).subscribe({
      next: (podcast) => {
        this.podcast = podcast;
        this.isLoading = false;

        if (podcast.status === 'error') {
          this.hasError = true;
          this.errorMessage = podcast.errorMessage || 'Erreur lors du chargement du podcast';
        } else {
          // Charger les podcasts suivant et précédent
          this.loadNextPodcast(podcast.id);
          this.loadPreviousPodcast(podcast.id);
        }
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Podcast introuvable';
      }
    });
  }

  private loadNextPodcast(currentPodcastId: number): void {
    this.podcastService.getNextPodcast(currentPodcastId).subscribe({
      next: (nextPodcast) => {
        this.nextPodcast = nextPodcast;
      },
      error: (error) => {
        console.log('Pas de podcast suivant disponible', error);
        this.nextPodcast = null;
      }
    });
  }

  private loadPreviousPodcast(currentPodcastId: number): void {
    this.podcastService.getPreviousPodcast(currentPodcastId).subscribe({
      next: (previousPodcast) => {
        this.previousPodcast = previousPodcast;
      },
      error: (error) => {
        console.log('Pas de podcast précédent disponible', error);
        this.previousPodcast = null;
      }
    });
  }

  onAudioLoaded(): void {
    if (this.audioPlayerRef?.nativeElement) {
      this.audioElement = this.audioPlayerRef.nativeElement;
      this.duration = this.audioElement.duration || 0;
      this.setupAudioListeners();
    }
  }

  private setupAudioListeners(): void {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement?.currentTime || 0;
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });
  }

  togglePlayPause(): void {
    if (!this.audioElement) return;

    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
  }

  onSeek(event: Event): void {
    if (!this.audioElement) return;
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  getProgressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  goToNextPodcast(): void {
    if (this.nextPodcast) {
      this.cleanup();
      this.router.navigate(['/podcast', this.nextPodcast.id]);
    }
  }

  goToPreviousPodcast(): void {
    if (this.previousPodcast) {
      this.cleanup();
      this.router.navigate(['/podcast', this.previousPodcast.id]);
    }
  }

  getPodcastImage(): string {
    if (!this.podcast) return '';
    return this.podcast.content.image?.url || this.podcast.content.meta_media.logo;
  }

  private cleanup(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
  }
}
