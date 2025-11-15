import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

const routes: Routes = [
  // Routes with layout (main app navigation)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'feed', loadChildren: () => import('./features/feed/feed.module').then(m => m.FeedModule) },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'informations', loadChildren: () => import('./features/informations/informations.module').then(m => m.InformationsModule) },
      { path: '', pathMatch: 'full', redirectTo: 'feed' }
    ]
  },
  // Routes without layout (standalone pages)
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'share', loadChildren: () => import('./share/share.module').then(m => m.ShareModule) },
  // Fallback
  { path: '**', redirectTo: 'feed' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
