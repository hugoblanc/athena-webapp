import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentDetailsRoutingModule } from './content-details-routing.module';
import { ContentDetailsComponent } from './content-details.component';
import { SharedModule } from '../../shared/shared.module';
import { contentServiceProvider } from '../../core/services/content/content.service.provider';

@NgModule({
  declarations: [
    ContentDetailsComponent
  ],
  imports: [
    CommonModule,
    ContentDetailsRoutingModule,
    SharedModule
  ],
  providers: [
    contentServiceProvider
  ]
})
export class ContentDetailsModule { }
