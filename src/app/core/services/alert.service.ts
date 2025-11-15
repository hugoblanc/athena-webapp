import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /**
   * Show a simple snackbar message
   * @param message The message to display
   * @param action Optional action button text
   * @param duration Duration in milliseconds (default 3000)
   */
  show(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  /**
   * Show an error message
   * @param message The error message
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Open an external link with confirmation
   * @param title The title of the dialog
   * @param message The message to display
   * @param link The external link to open
   */
  openExternalLink(title: string, message: string, link: string): void {
    const snackBarRef = this.snackBar.open(message, 'Ouvrir', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    snackBarRef.onAction().subscribe(() => {
      window.open(link, '_blank');
    });
  }
}
