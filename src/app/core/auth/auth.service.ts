import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  private idToken$ = new BehaviorSubject<string | null>(null);

  constructor(private auth: Auth) {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        this.currentUser$.next(authUser);

        // Get and store ID token
        const token = await user.getIdToken();
        this.idToken$.next(token);
      } else {
        this.currentUser$.next(null);
        this.idToken$.next(null);
      }
    });
  }

  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  signInWithEmail(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  registerWithEmail(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  getIdToken(): Observable<string | null> {
    return this.idToken$.asObservable();
  }

  async refreshToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      this.idToken$.next(token);
      return token;
    }
    return null;
  }
}
