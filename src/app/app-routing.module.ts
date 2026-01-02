import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { CurrentMetaMediaGuard } from './core/guards/current-meta-media.guard';

const routes: Routes = [
  // Routes with layout (main app navigation)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'feed', loadChildren: () => import('./features/feed/feed.module').then(m => m.FeedModule) },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'qa', loadChildren: () => import('./features/qa/qa.module').then(m => m.QaModule) },
      { path: 'propositions', loadChildren: () => import('./features/law-proposals/law-proposals.module').then(m => m.LawProposalsModule) },
      { path: 'informations', loadChildren: () => import('./features/informations/informations.module').then(m => m.InformationsModule) },
      {
        path: 'media/:key',
        loadChildren: () => import('./features/media/media.module').then(m => m.MediaModule),
        canActivate: [CurrentMetaMediaGuard]
      },
      {
        path: 'content/:key/:id',
        loadChildren: () => import('./features/content-details/content-details.module').then(m => m.ContentDetailsModule),
        canActivate: [CurrentMetaMediaGuard]
      },
      { path: '', pathMatch: 'full', redirectTo: 'feed' }
    ]
  },
  // Routes without layout (standalone pages)
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'share', loadChildren: () => import('./share/share.module').then(m => m.ShareModule) },
  { path: 'podcast', loadChildren: () => import('./podcast/podcast.module').then(m => m.PodcastModule) },
  // Auth routes (without layout)
  { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  // Fallback
  { path: '**', redirectTo: 'feed' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
