import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private readonly http: HttpClient) {}

  /**
   * GET request
   * @param url The URL to fetch
   * @param options Optional HTTP options
   */
  get<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    console.warn('Ready to call', url);
    return this.http.get<T>(url, options).pipe(
      tap({
        next: () => console.log(`GET ${url} succeeded`),
        error: (error) => console.error(`GET ${url} failed:`, error)
      })
    );
  }

  /**
   * POST request
   * @param url The URL to post to
   * @param body The request body
   * @param options Optional HTTP options
   */
  post<T>(url: string, body?: any, options?: { headers?: HttpHeaders }): Observable<T> {
    console.warn('Ready to call', url);
    return this.http.post<T>(url, body, options).pipe(
      tap({
        next: () => console.log(`POST ${url} succeeded`),
        error: (error) => console.error(`POST ${url} failed:`, error)
      })
    );
  }

  /**
   * PUT request
   * @param url The URL to put to
   * @param body The request body
   * @param options Optional HTTP options
   */
  put<T>(url: string, body?: any, options?: { headers?: HttpHeaders }): Observable<T> {
    console.warn('Ready to call', url);
    return this.http.put<T>(url, body, options).pipe(
      tap({
        next: () => console.log(`PUT ${url} succeeded`),
        error: (error) => console.error(`PUT ${url} failed:`, error)
      })
    );
  }

  /**
   * DELETE request
   * @param url The URL to delete
   * @param options Optional HTTP options
   */
  delete<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    console.warn('Ready to call', url);
    return this.http.delete<T>(url, options).pipe(
      tap({
        next: () => console.log(`DELETE ${url} succeeded`),
        error: (error) => console.error(`DELETE ${url} failed:`, error)
      })
    );
  }
}
