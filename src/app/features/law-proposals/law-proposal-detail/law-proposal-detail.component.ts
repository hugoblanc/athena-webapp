import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  LawProposal,
  POLITICAL_GROUPS,
  PoliticalGroupCode
} from '../../../models/law-proposal.model';
import { LawProposalsService } from '../services/law-proposals.service';

@Component({
  selector: 'app-law-proposal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './law-proposal-detail.component.html',
  styleUrls: ['./law-proposal-detail.component.scss']
})
export class LawProposalDetailComponent implements OnInit, OnDestroy {
  proposal: LawProposal | null = null;
  isLoading = false;
  selectedTabIndex = 0; // 0 = simplified, 1 = official
  politicalGroups = POLITICAL_GROUPS;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lawProposalsService: LawProposalsService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const numero = params['numero'];
        if (numero) {
          this.loadProposal(numero);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProposal(numero: string): void {
    this.isLoading = true;

    this.lawProposalsService
      .getLawProposal(numero)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (proposal) => {
          this.proposal = proposal;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading proposal:', error);
          this.isLoading = false;
          // Redirect to list on error
          this.router.navigate(['/propositions']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/propositions']);
  }

  getPoliticalGroupColor(code: string): string {
    const groupCode = code as PoliticalGroupCode;
    return this.politicalGroups[groupCode]?.color || this.politicalGroups.UNKNOWN.color;
  }

  getPoliticalGroupName(code: string): string {
    const groupCode = code as PoliticalGroupCode;
    return this.politicalGroups[groupCode]?.name || this.politicalGroups.UNKNOWN.name;
  }

  openDocument(): void {
    if (this.proposal?.urlDocument) {
      const url = this.lawProposalsService.getDocumentUrl(this.proposal.urlDocument);
      window.open(url, '_blank');
    }
  }

  openDossier(): void {
    if (this.proposal?.urlDossierLegislatif) {
      const url = this.lawProposalsService.getDossierUrl(this.proposal.urlDossierLegislatif);
      window.open(url, '_blank');
    }
  }

  openDeputeProfile(url: string | null): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getStatusColor(status: 'completed' | 'pending' | 'failed'): string {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#999999';
    }
  }

  getStatusLabel(status: 'completed' | 'pending' | 'failed'): string {
    switch (status) {
      case 'completed':
        return 'Simplifiée';
      case 'pending':
        return 'En cours de simplification';
      case 'failed':
        return 'Simplification non disponible';
      default:
        return 'Inconnu';
    }
  }

  getSectionTypeLabel(type: string): string {
    switch (type) {
      case 'expose_motifs':
        return 'Exposé des motifs';
      case 'articles':
        return 'Articles';
      case 'sommaire':
        return 'Sommaire';
      case 'autre':
        return 'Autre';
      default:
        return type;
    }
  }
}
