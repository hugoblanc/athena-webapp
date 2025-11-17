import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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

  navItems = [
    { label: 'Feed', icon: 'dynamic_feed', route: '/feed' },
    { label: 'Accueil', icon: 'home', route: '/home' },
    { label: 'Q&A', icon: 'question_answer', route: '/qa' },
    { label: 'Informations', icon: 'info', route: '/informations' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}
}
