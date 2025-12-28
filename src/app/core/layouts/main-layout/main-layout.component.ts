import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService, AuthUser } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  user$: Observable<AuthUser | null>;

  navItems = [
    { label: 'Feed', icon: 'dynamic_feed', route: '/feed' },
    { label: 'Accueil', icon: 'home', route: '/home' },
    { label: 'Q&A', icon: 'question_answer', route: '/qa' },
    { label: 'Propositions', icon: 'gavel', route: '/propositions/list' },
    { label: 'Informations', icon: 'info', route: '/informations' }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.user$ = this.authService.getCurrentUser();
  }

  ngOnInit(): void {}
}
