import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadComponent } from './download/download.component';
import { ShareComponent } from './share.component';

const routes: Routes = [
  { path: 'download', component: DownloadComponent },
  { path: ':key/:contentId', component: ShareComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule { }
