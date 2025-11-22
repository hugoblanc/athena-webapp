import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QaService } from './services/qa.service';
import { QaHistoryItem, QaSource } from '../../models/qa.model';
import { AlertService } from '../../core/services/alert.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss'],
})
export class QaComponent implements OnInit, OnDestroy {
  questionForm: FormGroup;
  isLoading = false;
  isStreaming = false;
  currentQuestion = '';
  streamedAnswer = '';
  sources: QaSource[] = [];
  history: QaHistoryItem[] = [];
  showHistory = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private qaService: QaService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer
  ) {
    this.questionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHistory(): void {
    this.qaService
      .getHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.history = response.items;
        },
        error: (error) => {
          console.error('Error loading history:', error);
        },
      });
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      return;
    }

    const question = this.questionForm.value.question.trim();
    this.currentQuestion = question;
    this.streamedAnswer = '';
    this.sources = [];
    this.isStreaming = false;
    this.isLoading = true;

    // Clear the input immediately
    this.questionForm.reset();

    // Step 1: Ask the question to get jobId
    this.qaService
      .askQuestion(question)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const jobId = response.jobId;
          this.isLoading = false;
          this.isStreaming = true;

          // Step 2: Stream the answer using the jobId
          this.qaService
            .streamAnswer(jobId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (event) => {
                // Utiliser NgZone pour s'assurer que les changements sont détectés
                this.ngZone.run(() => {
                  if (event.type === 'token' && event.content) {
                    // Append token to the answer
                    this.streamedAnswer += event.content;
                    console.log(
                      'Token received:',
                      event.content,
                      'Total length:',
                      this.streamedAnswer.length
                    );
                    this.cdr.detectChanges();
                  } else if (event.type === 'done' && event.sources) {
                    // Set sources when done
                    this.sources = event.sources;
                    console.log('Sources received:', this.sources.length);
                    this.cdr.detectChanges();
                  } else if (event.type === 'error') {
                    console.error('Stream error:', event.error);
                    this.alertService.showError(
                      event.error ||
                        'Erreur lors de la génération de la réponse.'
                    );
                  }
                });
              },
              error: (error) => {
                this.ngZone.run(() => {
                  this.isStreaming = false;
                  console.error('Error streaming answer:', error);
                  this.alertService.showError(
                    'Impossible de récupérer la réponse. Veuillez réessayer.'
                  );
                  this.cdr.detectChanges();
                });
              },
              complete: () => {
                this.ngZone.run(() => {
                  this.isStreaming = false;
                  console.log(
                    'Stream complete. Final answer length:',
                    this.streamedAnswer.length
                  );
                  // Reload history to include the new Q&A
                  this.loadHistory();
                  this.cdr.detectChanges();
                });
              },
            });
        },
        error: (error) => {
          this.isLoading = false;
          this.isStreaming = false;
          console.error('Error asking question:', error);
          this.alertService.showError(
            "Impossible d'envoyer la question. Veuillez réessayer."
          );
        },
      });
  }

  navigateToContent(source: QaSource): void {
    if (!source.mediaKey) {
      console.error('Cannot navigate: missing mediaKey', source);
      this.alertService.showError("Impossible d'accéder à cet article.");
      return;
    }

    this.router.navigate(['/content', source.mediaKey, source.contentId]);
  }

  loadHistoryItem(item: QaHistoryItem): void {
    this.currentQuestion = item.question;
    this.streamedAnswer = item.answer;
    this.sources = item.sources;
    this.questionForm.patchValue({ question: item.question });
  }

  clearAnswer(): void {
    this.currentQuestion = '';
    this.streamedAnswer = '';
    this.sources = [];
    this.questionForm.reset();
  }

  get hasAnswer(): boolean {
    return this.streamedAnswer.length > 0;
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onKeyDown(event: KeyboardEvent): void {
    // Send on Enter (but allow Shift+Enter for new line)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  /**
   * Parse answer text to convert inline article citations to clickable links
   * Pattern: [contentId:X,mediaKey:Y] -> clickable link
   */
  parseAnswerWithLinks(text: string): SafeHtml {
    if (!text) return '';

    // Pattern to match: [contentId:123,mediaKey:relevepeste]
    const pattern = /\[contentId:(\d+),mediaKey:([a-zA-Z0-9_-]+)\]/g;

    // Escape HTML in the original text first to prevent XSS
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Replace citation patterns with clickable links
    const htmlText = escapedText.replace(
      pattern,
      (_match, contentId, mediaKey) => {
        return `<a href="#" class="inline-source" data-content-id="${contentId}" data-media-key="${mediaKey}">source</a>`;
      }
    );

    // Bypass security as we've already escaped the original text
    return this.sanitizer.bypassSecurityTrustHtml(htmlText);
  }

  /**
   * Handle click on inline source links
   */
  onInlineSourceClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    // Check if the clicked element or its parent is an inline-source link
    let sourceElement: HTMLElement | null = target;
    while (sourceElement && !sourceElement.classList.contains('inline-source')) {
      sourceElement = sourceElement.parentElement;
    }

    if (sourceElement && sourceElement.classList.contains('inline-source')) {
      const contentId = sourceElement.getAttribute('data-content-id');
      const mediaKey = sourceElement.getAttribute('data-media-key');

      if (contentId && mediaKey) {
        console.log('Navigating to article:', { contentId, mediaKey });
        this.router.navigate(['/content', mediaKey, contentId]);
      }
    }
  }
}
