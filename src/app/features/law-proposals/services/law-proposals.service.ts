import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LawProposal,
  LawProposalsListResponse,
  LawProposalsQueryParams,
} from '../../../models/law-proposal.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LawProposalsService {
  private readonly apiUrl = `${environment.apiUrl}/law-proposal`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of law proposals with optional filters
   * @param params Query parameters for filtering and pagination
   * @returns Observable of LawProposalsListResponse
   */
  getLawProposals(
    params?: LawProposalsQueryParams
  ): Observable<LawProposalsListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      // Pagination
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.limit !== undefined) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }

      // Sorting
      if (params.sort) {
        httpParams = httpParams.set('sort', params.sort);
      }

      // Filters
      if (params['filter[groupePolitique]']) {
        httpParams = httpParams.set(
          'filter[groupePolitique]',
          params['filter[groupePolitique]']
        );
      }
      if (params['filter[typeProposition]']) {
        httpParams = httpParams.set(
          'filter[typeProposition]',
          params['filter[typeProposition]']
        );
      }
      if (params['filter[dateDebut]']) {
        httpParams = httpParams.set(
          'filter[dateDebut]',
          params['filter[dateDebut]']
        );
      }
      if (params['filter[dateFin]']) {
        httpParams = httpParams.set(
          'filter[dateFin]',
          params['filter[dateFin]']
        );
      }
      if (params['filter[simplificationStatus]']) {
        httpParams = httpParams.set(
          'filter[simplificationStatus]',
          params['filter[simplificationStatus]']
        );
      }
    }

    return this.http.get<LawProposalsListResponse>(this.apiUrl, {
      params: httpParams,
    });
  }

  /**
   * Get detailed information about a specific law proposal
   * @param numero Law proposal number (e.g., "2111")
   * @returns Observable of LawProposal
   */
  getLawProposal(numero: string): Observable<LawProposal> {
    return this.http.get<LawProposal>(`${this.apiUrl}/${numero}`);
  }

  /**
   * Get URL for the official PDF document
   * @param urlDocument Document URL from the law proposal
   * @returns Full URL to the PDF
   */
  getDocumentUrl(urlDocument: string): string {
    // If it's already a full URL, return as-is
    if (
      urlDocument.startsWith('http://') ||
      urlDocument.startsWith('https://')
    ) {
      return urlDocument;
    }
    // Otherwise, assume it's a relative path on assemblee-nationale.fr
    return `https://www.assemblee-nationale.fr${urlDocument}`;
  }

  /**
   * Get URL for the legislative dossier
   * @param urlDossierLegislatif Dossier URL from the law proposal
   * @returns Full URL to the dossier
   */
  getDossierUrl(urlDossierLegislatif: string): string {
    if (
      urlDossierLegislatif.startsWith('http://') ||
      urlDossierLegislatif.startsWith('https://')
    ) {
      return urlDossierLegislatif;
    }
    return `https://www.assemblee-nationale.fr${urlDossierLegislatif}`;
  }
}
