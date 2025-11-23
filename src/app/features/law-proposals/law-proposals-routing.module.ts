import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./law-proposals-list/law-proposals-list.component').then(
        (m) => m.LawProposalsListComponent
      )
  },
  {
    path: ':numero',
    loadComponent: () =>
      import('./law-proposal-detail/law-proposal-detail.component').then(
        (m) => m.LawProposalDetailComponent
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawProposalsRoutingModule {}
