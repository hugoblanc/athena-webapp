import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getIdToken().pipe(
      take(1),
      switchMap(token => {
        // Clone the request and add authorization header if token exists
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        }

        // If no token, proceed with original request
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        // If 401 Unauthorized, try to refresh token
        if (error.status === 401) {
          return this.handleUnauthorizedError(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Try to refresh the token
    return new Observable(observer => {
      this.authService.refreshToken().then(newToken => {
        if (newToken) {
          // Retry the request with new token
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          next.handle(cloned).subscribe({
            next: (event) => observer.next(event),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
          });
        } else {
          // No token available, return error
          observer.error(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
        }
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
