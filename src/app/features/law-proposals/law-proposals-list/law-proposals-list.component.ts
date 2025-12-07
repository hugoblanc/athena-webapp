import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import {
  LawProposalSummary,
  Pagination,
  POLITICAL_GROUPS,
  PoliticalGroupCode
} from '../../../models/law-proposal.model';
import { LawProposalsService } from '../services/law-proposals.service';

@Component({
  selector: 'app-law-proposals-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './law-proposals-list.component.html',
  styleUrls: ['./law-proposals-list.component.scss']
})
export class LawProposalsListComponent implements OnInit, OnDestroy {
  proposals: LawProposalSummary[] = [];
  pagination: Pagination | null = null;
  filterForm: FormGroup;
  isLoading = false;
  politicalGroups = POLITICAL_GROUPS;

  private destroy$ = new Subject<void>();

  // Filter options
  proposalTypes = [
    { value: 'ordinaire', label: 'Ordinaire' },
    { value: 'constitutionnelle', label: 'Constitutionnelle' }
  ];

  simplificationStatuses = [
    { value: 'completed', label: 'Simplifiée' },
    { value: 'pending', label: 'En cours' },
    { value: 'failed', label: 'Échec' }
  ];

  sortOptions = [
    { value: 'dateMiseEnLigne:desc', label: 'Plus récentes' },
    { value: 'dateMiseEnLigne:asc', label: 'Plus anciennes' },
    { value: 'titre:asc', label: 'Titre (A-Z)' },
    { value: 'titre:desc', label: 'Titre (Z-A)' },
    { value: 'numero:asc', label: 'Numéro (croissant)' },
    { value: 'numero:desc', label: 'Numéro (décroissant)' }
  ];

  constructor(
    private lawProposalsService: LawProposalsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      groupePolitique: [''],
      typeProposition: [''],
      simplificationStatus: [''],
      sort: ['dateMiseEnLigne:desc']
    });
  }

  ngOnInit(): void {
    this.loadProposals();

    // Watch for filter changes and reload with debounce
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadProposals();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProposals(page: number = 1, limit: number = 20): void {
    this.isLoading = true;

    const filters = this.filterForm.value;
    const params: any = {
      page,
      limit
    };

    // Only add sort if it has a value
    if (filters.sort) {
      params.sort = filters.sort;
    }

    if (filters.groupePolitique) {
      params.groupePolitique = filters.groupePolitique;
    }
    if (filters.typeProposition) {
      params.typeProposition = filters.typeProposition;
    }
    if (filters.simplificationStatus) {
      params.simplificationStatus = filters.simplificationStatus;
    }

    console.log('Loading proposals with params:', params);

    this.lawProposalsService
      .getLawProposals(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Received response:', response);
          this.proposals = response.data;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading proposals:', error);
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.loadProposals(event.pageIndex + 1, event.pageSize);
  }

  viewProposal(numero: string): void {
    this.router.navigate(['/propositions', numero]);
  }

  getPoliticalGroupColor(code: string): string {
    const groupCode = code as PoliticalGroupCode;
    return this.politicalGroups[groupCode]?.color || this.politicalGroups.UNKNOWN.color;
  }

  getPoliticalGroupName(code: string): string {
    const groupCode = code as PoliticalGroupCode;
    return this.politicalGroups[groupCode]?.name || this.politicalGroups.UNKNOWN.name;
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
        return 'En cours';
      case 'failed':
        return 'Non disponible';
      default:
        return 'Inconnu';
    }
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      groupePolitique: '',
      typeProposition: '',
      simplificationStatus: '',
      sort: 'dateMiseEnLigne:desc'
    });
  }
}
